import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'
import { nav, company, img } from '../data/site.js'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="Zur Startseite">
          <img src={img.logo} alt={`${company.name} Logo`} className="nav__logo" />
          <span className="nav__brand-text">
            Weiß Forst<span> GbR</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Hauptnavigation">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/kontakt" className="btn btn-primary nav__cta">
            Anfrage senden
          </Link>
        </nav>

        <button
          className="nav__toggle"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'X' : 'Menu'} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__drawer"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile Navigation">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav__drawer-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Link to="/kontakt" className="btn btn-primary">
              Anfrage senden
            </Link>
            <div className="nav__drawer-contact">
              <a href={company.phoneHref}>
                <Icon name="Phone" /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`}>
                <Icon name="Mail" /> {company.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="nav__scrim" onClick={() => setOpen(false)} />}
    </header>
  )
}
