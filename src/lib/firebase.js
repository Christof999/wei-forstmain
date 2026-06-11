// Firebase-Initialisierung.
// Die Konfiguration kommt aus Umgebungsvariablen (.env – siehe .env.example).
// Es gibt KEINE Authentifizierung: Die Seite ist öffentlich.
//   - Galerie & Beiträge: werden nur GELESEN (Pflege über die Firebase Console)
//   - Kontaktanfragen: werden vom Besucher angelegt (nur create)
// Solange keine gültige Config gesetzt ist, läuft die Seite im "Demo-Modus"
// (Galerie/Beiträge nutzen Fallback-Daten, das Kontaktformular zeigt einen Hinweis).

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
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
  db = getFirestore(app)
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
// Galeriebilder werden einfach in den Storage-Ordner "gallery/" hochgeladen.
// Hier werden alle Dateien dieses Ordners aufgelistet und ihre Download-URLs
// geladen – es sind keine zusätzlichen Firestore-Einträge nötig.

const GALLERY_FOLDER = 'gallery'

export async function fetchGalleryImages() {
  if (!isFirebaseConfigured) return []
  const folderRef = ref(storage, GALLERY_FOLDER)
  const res = await listAll(folderRef)
  // Nach Dateiname sortieren (stabile, vorhersagbare Reihenfolge)
  const items = [...res.items].sort((a, b) => b.name.localeCompare(a.name))
  const urls = await Promise.all(
    items.map(async (item) => {
      try {
        const url = await getDownloadURL(item)
        return { id: item.fullPath, name: item.name, url }
      } catch {
        return null
      }
    }),
  )
  return urls.filter(Boolean)
}
