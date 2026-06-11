// Firebase-Initialisierung.
// Die Konfiguration kommt aus Umgebungsvariablen (.env – siehe .env.example).
// Solange keine gültige Config gesetzt ist, läuft die Seite im "Demo-Modus"
// (Galerie/Posts nutzen Fallback-Daten, das Kontaktformular zeigt einen Hinweis).

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

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
let auth = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  storage = getStorage(app)
  auth = getAuth(app)
}

export { app, db, storage, auth }

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

export async function fetchContactRequests() {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/* ---------------------------------- Posts --------------------------------- */

export async function fetchPosts() {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createPost(post) {
  if (!isFirebaseConfigured) throw new Error('NOT_CONFIGURED')
  return addDoc(collection(db, 'posts'), {
    ...post,
    createdAt: serverTimestamp(),
  })
}

export async function deletePost(id) {
  if (!isFirebaseConfigured) throw new Error('NOT_CONFIGURED')
  return deleteDoc(doc(db, 'posts', id))
}

/* --------------------------------- Galerie -------------------------------- */

export async function fetchGalleryImages() {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function uploadGalleryImage(file) {
  if (!isFirebaseConfigured) throw new Error('NOT_CONFIGURED')
  const path = `gallery/${Date.now()}-${file.name}`
  const sRef = storageRef(storage, path)
  await uploadBytes(sRef, file)
  const url = await getDownloadURL(sRef)
  return addDoc(collection(db, 'gallery'), {
    url,
    path,
    name: file.name,
    createdAt: serverTimestamp(),
  })
}

export async function deleteGalleryImage(item) {
  if (!isFirebaseConfigured) throw new Error('NOT_CONFIGURED')
  if (item.path) {
    try {
      await deleteObject(storageRef(storage, item.path))
    } catch (e) {
      // Datei evtl. bereits entfernt – Eintrag trotzdem löschen.
    }
  }
  return deleteDoc(doc(db, 'gallery', item.id))
}

/* ----------------------------------- Auth --------------------------------- */

export function login(email, password) {
  if (!isFirebaseConfigured) throw new Error('NOT_CONFIGURED')
  return signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
  if (!isFirebaseConfigured) return Promise.resolve()
  return signOut(auth)
}

export function watchAuth(callback) {
  if (!isFirebaseConfigured) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
