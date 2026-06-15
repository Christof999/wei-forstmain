import { useState } from 'react'
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
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const { consent, grant } = useConsent()

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email || !form.message) {
      setStatus('error')
      setErrorMsg('Bitte füllen Sie alle Felder aus.')
      return
    }
    setStatus('sending')
    setErrorMsg('')

    if (!isFirebaseConfigured) {
      // Fallback ohne Backend: E-Mail-Client öffnen.
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
    } catch (err) {
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
          {/* Kontaktdaten */}
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
                    WEISSFORST GBR
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

          {/* Formular */}
          <Reveal delay={0.1} className="contact-form card">
            <h2>Kontaktformular</h2>
            {status === 'success' ? (
              <div className="form-feedback form-feedback--ok">
                <Icon name="CheckCircle2" />
                <p>
                  Vielen Dank für Ihre Nachricht! Wir melden uns so schnell wie
                  möglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
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
                  />
                </div>

                {status === 'error' && (
                  <div className="form-feedback form-feedback--err">
                    <Icon name="AlertCircle" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary contact-form__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Icon name="Loader2" className="spin" /> Wird gesendet…
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

        {/* Karte */}
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
