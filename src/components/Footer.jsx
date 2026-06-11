import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { company, nav, img } from '../data/site.js'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__badge">
            <img src={img.logo} alt={`${company.name} Logo`} />
          </span>
          <div>
            <p className="footer__name">{company.name}</p>
            <p className="footer__tag">{company.tagline}</p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer-Navigation">
          <h3>Navigation</h3>
          {nav.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer__contact">
          <h3>Kontakt</h3>
          <a href={company.phoneHref}>
            <Icon name="Phone" /> {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>
            <Icon name="Mail" /> {company.email}
          </a>
          <p>
            <Icon name="MapPin" /> {company.address.line1}, {company.address.line2}
          </p>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {company.name}. Alle Rechte vorbehalten.
        </p>
        <div className="footer__legal">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </footer>
  )
}
