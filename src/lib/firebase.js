// Firebase-Initialisierung.
// Die Konfiguration kommt aus Umgebungsvariablen (.env – siehe .env.example).
// Es gibt KEINE Authentifizierung: Die Seite ist öffentlich.
//   - Galerie & Beiträge: werden nur GELESEN (Pflege über die Firebase Console)
//   - Kontaktanfragen: werden vom Besucher angelegt (nur create)
// Solange keine gültige Config gesetzt ist, läuft die Seite im "Demo-Modus"
// (Galerie/Beiträge nutzen Fallback-Daten, das Kontaktformular zeigt einen Hinweis).

import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let app = null
let db = null
let storage = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  // Long-Polling automatisch erkennen -> zuverlässige Verbindung auch hinter
  // Proxys/in Safari (verhindert die "WebChannel transport errored"-Warnung).
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  })
  storage = getStorage(app)
}

export { app, db, storage }

/* ----------------------------- Kontaktanfragen ---------------------------- */

export async function submitContactRequest(data) {
  if (!isFirebaseConfigured) {
    throw new Error('NOT_CONFIGURED')
  }
  return addDoc(collection(db, 'contactRequests'), {
    ...data,
    createdAt: serverTimestamp(),
    handled: false,
  })
}

/* ---------------------------------- Posts --------------------------------- */

export async function fetchPosts() {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/* --------------------------------- Galerie -------------------------------- */
// Galeriebilder werden einfach in den Firebase Storage hochgeladen – entweder
// direkt in den Bucket-Root oder in einen Ordner "gallery/". Beide Orte werden
// durchsucht; aus jeder Bilddatei wird die Download-URL geladen. Es sind keine
// zusätzlichen Firestore-Einträge nötig.

const GALLERY_FOLDERS = ['', 'gallery']
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i
// Dateien, die im Storage liegen, aber NICHT in der Galerie erscheinen sollen
// (z. B. das Zertifikat, das auf der "Über uns"-Seite eingebunden ist).
const GALLERY_EXCLUDE = new Set(['img_5877.jpg', 'img_5877.jpeg'])

// Im Admin-Bereich per Drag & Drop festgelegte Reihenfolge der Galerie.
// Sie wird in Firestore unter gallery/_order im Feld "order" gespeichert
// (Array der Storage-fullPaths) – exakt dieselbe Struktur, die die Admin-App
// schreibt, damit die Sortierung 1:1 auf der Website übernommen wird.
const GALLERY_ORDER_COLLECTION = 'gallery'
const GALLERY_ORDER_DOC = '_order'

export async function fetchGalleryOrder() {
  if (!isFirebaseConfigured) return []
  try {
    const snap = await getDoc(doc(db, GALLERY_ORDER_COLLECTION, GALLERY_ORDER_DOC))
    const order = snap.exists() ? snap.data()?.order : null
    return Array.isArray(order) ? order.filter((p) => typeof p === 'string') : []
  } catch {
    return []
  }
}

// Bilder gemäß der gespeicherten Reihenfolge sortieren: Bilder, die in der
// Reihenfolge-Liste stehen, zuerst (nach ihrer Position); alle übrigen danach,
// absteigend nach Dateiname. Identische Logik wie in der Admin-App.
function applyGalleryOrder(images, order) {
  if (!Array.isArray(order) || order.length === 0) return images
  const rank = new Map(order.map((fullPath, i) => [fullPath, i]))
  return [...images].sort((a, b) => {
    const ra = rank.has(a.fullPath) ? rank.get(a.fullPath) : Infinity
    const rb = rank.has(b.fullPath) ? rank.get(b.fullPath) : Infinity
    if (ra !== rb) return ra - rb
    return b.name.localeCompare(a.name)
  })
}

export async function fetchGalleryImages() {
  if (!isFirebaseConfigured) return []

  const [lists, order] = await Promise.all([
    Promise.allSettled(GALLERY_FOLDERS.map((path) => listAll(ref(storage, path)))),
    fetchGalleryOrder(),
  ])

  const seen = new Set()
  const items = []
  for (const result of lists) {
    if (result.status !== 'fulfilled') continue
    for (const item of result.value.items) {
      if (seen.has(item.fullPath)) continue
      seen.add(item.fullPath)
      if (GALLERY_EXCLUDE.has(item.name.toLowerCase())) continue
      if (IMAGE_RE.test(item.name)) items.push(item)
    }
  }
  // Standard-Reihenfolge (falls keine eigene gepflegt ist): Dateiname absteigend.
  items.sort((a, b) => b.name.localeCompare(a.name))

  const urls = await Promise.all(
    items.map(async (item) => {
      try {
        return {
          id: item.fullPath,
          name: item.name,
          fullPath: item.fullPath,
          url: await getDownloadURL(item),
        }
      } catch {
        return null
      }
    }),
  )
  // Im Admin per Drag & Drop festgelegte Reihenfolge anwenden.
  return applyGalleryOrder(urls.filter(Boolean), order)
}
