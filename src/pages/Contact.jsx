import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { company } from '../data/site.js'
import { submitContactRequest, isFirebaseConfigured } from '../lib/firebase.js'
import { useConsent } from '../lib/consent.jsx'
import './Contact.css'

const initial = { name: '', phone: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const { consent, grant } = useConsent()
  const successRef = useRef(null)
  const errorRef = useRef(null)

  const handleChange = (e) => {
    const { name } = e.target
    setForm((f) => ({ ...f, [name]: e.target.value }))
    if (fieldErrors[name]) {
      setFieldErrors((errs) => ({ ...errs, [name]: false }))
    }
  }

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'error') errorRef.current?.focus()
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const missing = {}
    if (!form.name.trim()) missing.name = true
    if (!form.phone.trim()) missing.phone = true
    if (!form.email.trim()) missing.email = true
    if (!form.message.trim()) missing.message = true

    if (Object.keys(missing).length) {
      setFieldErrors(missing)
      setStatus('error')
      setErrorMsg('Bitte füllen Sie alle Pflichtfelder aus.')
      const firstMissing = ['name', 'phone', 'email', 'message'].find((key) => missing[key])
      if (firstMissing) {
        document.getElementById(firstMissing)?.focus()
      }
      return
    }

    setStatus('sending')
    setErrorMsg('')
    setFieldErrors({})

    if (!isFirebaseConfigured) {
      const body = encodeURIComponent(
        `Name: ${form.name}\nTelefon: ${form.phone}\nE-Mail: ${form.email}\n\n${form.message}`,
      )
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        'Anfrage über die Website',
      )}&body=${body}`
      setStatus('success')
      setForm(initial)
      return
    }

    try {
      await submitContactRequest(form)
      setStatus('success')
      setForm(initial)
    } catch {
      setStatus('error')
      setErrorMsg(
        'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder rufen Sie uns an.',
      )
    }
  }

  return (
    <PageTransition>
      <Seo path="/kontakt" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Kontakt</span>
          <h1>Kontakt</h1>
          <p>
            Haben Sie Fragen zu unseren Dienstleistungen oder möchten Sie ein
            individuelles Angebot? Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info card">
            <h2>Unsere Kontaktdaten</h2>
            <ul className="contact-info__list">
              <li>
                <span className="contact-info__icon">
                  <Icon name="Building2" />
                </span>
                <div>
                  <h3>Firma</h3>
                  <p>
                    WEISS FORST GBR
                    <br />
                    {company.address.person}
                  </p>
                </div>
              </li>
              <li>
                <span className="contact-info__icon">
                  <Icon name="MapPin" />
                </span>
                <div>
                  <h3>Adresse</h3>
                  <p>
                    {company.address.line1}
                    <br />
                    {company.address.line2}
                  </p>
                </div>
              </li>
              <li>
                <span className="contact-info__icon">
                  <Icon name="Phone" />
                </span>
                <div>
                  <h3>Telefon</h3>
                  <p>
                    <a href={company.phoneHref}>{company.phone}</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="contact-info__icon">
                  <Icon name="Mail" />
                </span>
                <div>
                  <h3>E-Mail</h3>
                  <p>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal className="contact-form card">
            <h2>Kontaktformular</h2>
            {status === 'success' ? (
              <div
                ref={successRef}
                className="form-feedback form-feedback--ok"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <Icon name="CheckCircle2" />
                <p>
                  Vielen Dank für Ihre Nachricht! Wir melden uns so schnell wie
                  möglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-busy={status === 'sending'}
              >
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.name || undefined}
                    aria-describedby={status === 'error' ? 'contact-error' : undefined}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.phone || undefined}
                    aria-describedby={status === 'error' ? 'contact-error' : undefined}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.email || undefined}
                    aria-describedby={status === 'error' ? 'contact-error' : undefined}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Nachricht</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.message || undefined}
                    aria-describedby={status === 'error' ? 'contact-error' : undefined}
                  />
                </div>

                {status === 'error' && (
                  <div
                    ref={errorRef}
                    id="contact-error"
                    className="form-feedback form-feedback--err"
                    role="alert"
                    tabIndex={-1}
                  >
                    <Icon name="AlertCircle" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <p className="form-privacy" id="contact-privacy">
                  Mit dem Absenden willigen Sie in die Verarbeitung Ihrer Angaben
                  zur Bearbeitung Ihrer Anfrage ein. Weitere Informationen finden
                  Sie in unserer{' '}
                  <Link to="/datenschutz">Datenschutzerklärung</Link>.
                </p>

                <button
                  type="submit"
                  className="btn btn-primary contact-form__submit"
                  disabled={status === 'sending'}
                  aria-disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Icon name="Loader2" className="spin" aria-hidden="true" />
                      <span aria-live="polite">Wird gesendet…</span>
                    </>
                  ) : (
                    <>
                      Nachricht senden <Icon name="Send" />
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="contact-map">
            {consent.maps ? (
              <iframe
                title="Standort Weiß Forst GbR"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2660.169273399118!2d10.677103615826117!3d49.17350118036037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f1d54cf3b6b91%3A0xb641d37a9270aa35!2sHeglauer%20Stra%C3%9Fe%207%2C%2091732%20Merkendorf!5e0!3m2!1sde!2sde!4v1697034519948!5m2!1sde!2sde"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-consent">
                <div>
                  <p>
                    Zum Schutz Ihrer Daten wird die Google-Maps-Karte erst nach
                    Ihrer Zustimmung geladen. Dabei werden Daten (u.&nbsp;a. Ihre
                    IP-Adresse) an Google übertragen.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => grant('maps')}
                  >
                    <Icon name="MapPin" /> Karte anzeigen
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
