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

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { app, db }

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
// Galeriebilder werden in Firebase Storage abgelegt; in Firestore ('gallery')
// steht pro Bild ein Dokument mit der Download-URL. Pflege über die Console.

export async function fetchGalleryImages() {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
