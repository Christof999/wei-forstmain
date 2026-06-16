import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { nav, company, img } from '../data/site.js'
import { useFocusTrap } from '../lib/useFocusTrap.js'
import './Navbar.css'

const MOBILE_NAV_ID = 'mobile-nav'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const locationKeyRef = useRef('')
  const menuRef = useRef(null)
  const closeRef = useRef(null)

  const closeMenu = useCallback(() => setOpen(false), [])

  useFocusTrap(open, menuRef, {
    onEscape: closeMenu,
    initialFocusRef: closeRef,
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    locationKeyRef.current = `${location.pathname}${location.hash}`
  }, [location.pathname, location.hash])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return

    const openedAt = locationKeyRef.current
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''

      if (locationKeyRef.current === openedAt) {
        window.scrollTo(0, scrollY)
      }
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
          aria-controls={MOBILE_NAV_ID}
          onClick={() => setOpen(true)}
        >
          <Icon name="Menu" />
        </button>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              id={MOBILE_NAV_ID}
              className="nav__menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container nav__menu-head">
                <img src={img.logo} alt={`${company.name} Logo`} className="nav__menu-logo" />
                <button
                  ref={closeRef}
                  className="nav__menu-close"
                  aria-label="Menü schließen"
                  onClick={closeMenu}
                >
                  <Icon name="X" />
                </button>
              </div>

              <nav className="nav__menu-links" aria-label="Mobile Navigation">
                {nav.map((item) => (
                  <div key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `nav__menu-link ${isActive ? 'is-active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </div>
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
        </AnimatePresence>,
        document.body
      )}
    </header>
  )
}
