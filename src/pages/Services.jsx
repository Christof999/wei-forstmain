import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { services } from '../data/site.js'
import './Services.css'

export default function Services() {
  return (
    <PageTransition>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Dienstleistungen</span>
          <h1>Unsere Dienstleistungen</h1>
          <p>
            Ob Holzernte, Aufforstung, Zaunbau, Jungbestandspflege oder
            Brennholzaufarbeitung – wir übernehmen alle wichtigen Arbeiten in
            Ihrem Wald. Mit modernen Maschinen und einem nachhaltigen Ansatz.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container services-list">
          {services.map((s, i) => (
            <Reveal key={s.id} className="service-row">
              <div className={`service-row__inner ${i % 2 === 1 ? 'reverse' : ''}`}>
                <div className="service-row__media">
                  <img src={s.image} alt={s.title} loading="lazy" />
                  <span className="service-row__icon">
                    <Icon name={s.icon} />
                  </span>
                </div>
                <div className="service-row__body">
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                  <ul className="feature-list">
                    {s.features.map((f) => (
                      <li key={f}>
                        <Icon name="CheckCircle2" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>Maßgeschneiderte Lösungen für Ihren Wald</h2>
            <p>
              Jeder Wald ist einzigartig und benötigt individuelle Pflege.
              Kontaktieren Sie uns für eine persönliche Beratung!
            </p>
          </div>
          <div className="cta-band__actions">
            <Link to="/kontakt" className="btn btn-primary">
              Jetzt Kontakt aufnehmen <Icon name="ArrowRight" />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
