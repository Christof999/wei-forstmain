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
  addDoc,
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

export async function fetchGalleryImages() {
  if (!isFirebaseConfigured) return []

  const lists = await Promise.allSettled(
    GALLERY_FOLDERS.map((path) => listAll(ref(storage, path))),
  )

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
  // Nach Dateiname sortieren (stabile, vorhersagbare Reihenfolge)
  items.sort((a, b) => b.name.localeCompare(a.name))

  const urls = await Promise.all(
    items.map(async (item) => {
      try {
        return { id: item.fullPath, name: item.name, url: await getDownloadURL(item) }
      } catch {
        return null
      }
    }),
  )
  return urls.filter(Boolean)
}
