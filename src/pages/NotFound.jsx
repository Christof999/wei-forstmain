import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <PageTransition>
      <section
        className="section container"
        style={{ minHeight: '60vh', textAlign: 'center', paddingTop: 'calc(var(--header-h) + 60px)' }}
      >
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Fehler 404
        </span>
        <h1>Seite nicht gefunden</h1>
        <p style={{ color: 'var(--text-soft)', maxWidth: '46ch', margin: '0 auto 28px' }}>
          Die gewünschte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link to="/" className="btn btn-primary">
          Zur Startseite <Icon name="ArrowRight" />
        </Link>
      </section>
    </PageTransition>
  )
}
