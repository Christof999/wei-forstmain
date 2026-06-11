import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Icon from '../components/Icon.jsx'
import useAuth from '../lib/useAuth.js'
import {
  logout,
  isFirebaseConfigured,
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  fetchPosts,
  createPost,
  deletePost,
  fetchContactRequests,
} from '../lib/firebase.js'
import './Admin.css'

export default function Admin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('gallery')

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading) {
    return (
      <PageTransition>
        <section className="auth-wrap">
          <p>Lädt…</p>
        </section>
      </PageTransition>
    )
  }
  if (!user) return null

  return (
    <PageTransition>
      <section className="admin">
        <div className="container">
          <div className="admin__top">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Verwaltung</h1>
            </div>
            <button className="btn btn-outline" onClick={() => logout()}>
              <Icon name="LogOut" /> Abmelden
            </button>
          </div>

          <div className="admin__tabs">
            {[
              ['gallery', 'Galerie'],
              ['posts', 'Beiträge'],
              ['requests', 'Anfragen'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`admin__tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {!isFirebaseConfigured && (
            <div className="form-feedback form-feedback--err" style={{ marginBottom: 24 }}>
              <Icon name="AlertCircle" />
              <p>
                Firebase ist noch nicht konfiguriert – Lese-/Schreibfunktionen
                sind inaktiv. Siehe FIREBASE_SETUP.md.
              </p>
            </div>
          )}

          {tab === 'gallery' && <GalleryAdmin />}
          {tab === 'posts' && <PostsAdmin />}
          {tab === 'requests' && <RequestsAdmin />}
        </div>
      </section>
    </PageTransition>
  )
}

/* --------------------------------- Galerie -------------------------------- */
function GalleryAdmin() {
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(false)

  const load = () => fetchGalleryImages().then(setItems).catch(() => {})
  useEffect(() => {
    load()
  }, [])

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await uploadGalleryImage(file)
      await load()
    } catch (err) {
      alert('Upload fehlgeschlagen.')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const onDelete = async (item) => {
    if (!confirm('Bild wirklich löschen?')) return
    await deleteGalleryImage(item)
    await load()
  }

  return (
    <div>
      <label className="btn btn-primary admin__upload">
        <Icon name="Upload" /> {busy ? 'Lädt hoch…' : 'Bild hochladen'}
        <input type="file" accept="image/*" hidden onChange={onUpload} disabled={busy} />
      </label>
      <div className="admin__grid">
        {items.map((item) => (
          <div key={item.id} className="admin__thumb">
            <img src={item.url} alt={item.name || 'Galeriebild'} />
            <button onClick={() => onDelete(item)} aria-label="Löschen">
              <Icon name="Trash2" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="admin__empty">Noch keine Bilder hochgeladen.</p>}
      </div>
    </div>
  )
}

/* ---------------------------------- Posts --------------------------------- */
function PostsAdmin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', text: '', image: '' })
  const [busy, setBusy] = useState(false)

  const load = () => fetchPosts().then(setPosts).catch(() => {})
  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.text) return
    setBusy(true)
    try {
      await createPost(form)
      setForm({ title: '', text: '', image: '' })
      await load()
    } catch (err) {
      alert('Speichern fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Beitrag löschen?')) return
    await deletePost(id)
    await load()
  }

  return (
    <div className="admin__cols">
      <form className="card admin__form" onSubmit={submit}>
        <h3>Neuer Beitrag</h3>
        <div className="form-group">
          <label htmlFor="p-title">Titel</label>
          <input
            id="p-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="p-img">Bild-URL (optional)</label>
          <input
            id="p-img"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div className="form-group">
          <label htmlFor="p-text">Text</label>
          <textarea
            id="p-text"
            rows="5"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
        </div>
        <button className="btn btn-primary" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Speichert…' : 'Beitrag veröffentlichen'}
        </button>
      </form>

      <div className="admin__list">
        {posts.map((post) => (
          <div key={post.id} className="card admin__list-item">
            {post.image && <img src={post.image} alt="" />}
            <div>
              <h4>{post.title}</h4>
              <p>{post.text}</p>
            </div>
            <button onClick={() => remove(post.id)} aria-label="Löschen">
              <Icon name="Trash2" />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="admin__empty">Noch keine Beiträge.</p>}
      </div>
    </div>
  )
}

/* -------------------------------- Anfragen -------------------------------- */
function RequestsAdmin() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchContactRequests().then(setRequests).catch(() => {})
  }, [])

  return (
    <div className="admin__list">
      {requests.map((r) => (
        <div key={r.id} className="card admin__request">
          <div className="admin__request-head">
            <h4>{r.name}</h4>
            <span>
              {r.createdAt?.toDate
                ? r.createdAt.toDate().toLocaleString('de-DE')
                : ''}
            </span>
          </div>
          <p className="admin__request-meta">
            <a href={`tel:${r.phone}`}>{r.phone}</a> ·{' '}
            <a href={`mailto:${r.email}`}>{r.email}</a>
          </p>
          <p>{r.message}</p>
        </div>
      ))}
      {requests.length === 0 && <p className="admin__empty">Keine Anfragen vorhanden.</p>}
    </div>
  )
}
