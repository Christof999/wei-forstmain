import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useConsent } from '../lib/consent.jsx'
import './CookieBanner.css'

// Cookie-/Einwilligungs-Banner inkl. Detaileinstellungen.
// Wird ausschließlich clientseitig gerendert (kein Prerender), damit es im
// statischen HTML nicht erscheint und wiederkehrende Besucher es nicht sehen.
export default function CookieBanner() {
  const {
    consent,
    decided,
    acceptAll,
    rejectAll,
    save,
    settingsOpen,
    openSettings,
    closeSettings,
  } = useConsent()

  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState({ fonts: false, maps: false })

  useEffect(() => setMounted(true), [])

  // Beim Öffnen der Einstellungen aktuelle Werte übernehmen.
  useEffect(() => {
    if (settingsOpen) setPrefs({ fonts: consent.fonts, maps: consent.maps })
  }, [settingsOpen, consent.fonts, consent.maps])

  if (!mounted) return null

  const showBanner = !decided && !settingsOpen
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  return (
    <>
      {showBanner && (
        <div
          className="cookie-banner"
          role="dialog"
          aria-live="polite"
          aria-label="Hinweis zu Cookies und Datenschutz"
        >
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <h2>Datenschutz &amp; Cookies</h2>
              <p>
                Wir verwenden nur technisch notwendige Speicherung. Inhalte von
                Drittanbietern wie <strong>Google Fonts</strong> (Schriftarten)
                und <strong>Google Maps</strong> (Karte) werden erst nach Ihrer
                Einwilligung geladen. Ohne Zustimmung bleibt die Seite voll
                nutzbar. Details in unserer{' '}
                <Link to="/datenschutz">Datenschutzerklärung</Link>.
              </p>
            </div>
            <div className="cookie-banner__actions">
              <button type="button" className="btn btn-ghost" onClick={openSettings}>
                Einstellungen
              </button>
              <button type="button" className="btn btn-outline" onClick={rejectAll}>
                Nur notwendige
              </button>
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Datenschutz-Einstellungen">
          <div className="cookie-modal__backdrop" onClick={closeSettings} />
          <div className="cookie-modal__panel">
            <h2>Datenschutz-Einstellungen</h2>
            <p className="cookie-modal__lead">
              Entscheiden Sie selbst, welche externen Inhalte geladen werden
              dürfen. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen"
              im Seitenfuß ändern.
            </p>

            <ul className="cookie-options">
              <li className="cookie-option">
                <div className="cookie-option__head">
                  <span className="cookie-option__title">Notwendig</span>
                  <span className="cookie-option__badge">Immer aktiv</span>
                </div>
                <p>
                  Technisch erforderlich, u. a. zum Speichern Ihrer
                  Datenschutz-Auswahl. Es werden keine Daten an Dritte übertragen.
                </p>
              </li>

              <li className="cookie-option">
                <div className="cookie-option__head">
                  <span className="cookie-option__title">Schriftarten (Google Fonts)</span>
                  <label className="cookie-switch">
                    <input
                      type="checkbox"
                      checked={prefs.fonts}
                      onChange={() => toggle('fonts')}
                    />
                    <span className="cookie-switch__slider" />
                    <span className="visually-hidden">Google Fonts erlauben</span>
                  </label>
                </div>
                <p>
                  Lädt die Schriften „Fraunces" und „Inter" von Google. Dabei wird
                  Ihre IP-Adresse an Google übertragen. Ohne Zustimmung werden
                  System-Schriftarten verwendet.
                </p>
              </li>

              <li className="cookie-option">
                <div className="cookie-option__head">
                  <span className="cookie-option__title">Karte (Google Maps)</span>
                  <label className="cookie-switch">
                    <input
                      type="checkbox"
                      checked={prefs.maps}
                      onChange={() => toggle('maps')}
                    />
                    <span className="cookie-switch__slider" />
                    <span className="visually-hidden">Google Maps erlauben</span>
                  </label>
                </div>
                <p>
                  Zeigt unseren Standort über Google Maps. Dabei werden Daten
                  (u. a. IP-Adresse) an Google übertragen.
                </p>
              </li>
            </ul>

            <div className="cookie-modal__actions">
              <button type="button" className="btn btn-outline" onClick={rejectAll}>
                Nur notwendige
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => save(prefs)}
              >
                Auswahl speichern
              </button>
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
