import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Icon from '../components/Icon.jsx'
import useAuth from '../lib/useAuth.js'
import { login, isFirebaseConfigured } from '../lib/firebase.js'
import './Admin.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isFirebaseConfigured) {
      setError(
        'Firebase ist noch nicht konfiguriert. Bitte hinterlegen Sie zuerst die .env-Werte (siehe FIREBASE_SETUP.md).',
      )
      return
    }
    setBusy(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError('Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageTransition>
      <section className="auth-wrap">
        <div className="auth-card card">
          <h1>Admin-Login</h1>
          <p className="auth-sub">Interner Bereich der Weiß Forst GbR</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-Mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Passwort</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div className="form-feedback form-feedback--err">
                <Icon name="AlertCircle" />
                <p>{error}</p>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'Anmelden…' : 'Anmelden'}
            </button>
          </form>
        </div>
      </section>
    </PageTransition>
  )
}
