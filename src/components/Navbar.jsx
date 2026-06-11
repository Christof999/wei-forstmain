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
          aria-label="Menü öffnen"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Icon name="Menu" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container nav__menu-head">
              <img src={img.logo} alt={`${company.name} Logo`} className="nav__menu-logo" />
              <button
                className="nav__menu-close"
                aria-label="Menü schließen"
                onClick={() => setOpen(false)}
              >
                <Icon name="X" />
              </button>
            </div>

            <nav className="nav__menu-links" aria-label="Mobile Navigation">
              {nav.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `nav__menu-link ${isActive ? 'is-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="container nav__menu-foot">
              <Link to="/kontakt" className="btn btn-primary nav__menu-cta">
                Anfrage senden
              </Link>
              <div className="nav__menu-contact">
                <a href={company.phoneHref}>
                  <Icon name="Phone" /> {company.phone}
                </a>
                <a href={`mailto:${company.email}`}>
                  <Icon name="Mail" /> {company.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
