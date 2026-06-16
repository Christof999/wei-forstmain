import PageTransition from '../components/PageTransition.jsx'
import ExternalLink from '../components/ExternalLink.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { values, sloganLines, img } from '../data/site.js'
import './About.css'

export default function About() {
  return (
    <PageTransition>
      <Seo path="/ueber-uns" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Über uns</span>
          <h1>Über Weiß Forst GbR</h1>
          <p>
            Als familiengeführtes Unternehmen stehen wir für moderne,
            nachhaltige Forstwirtschaft und vielseitige Dienstleistungen rund um
            den Wald.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Werte</span>
            <h2>Unsere Grundwerte</h2>
          </Reveal>
          <div className="about-values">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="about-value card">
                <div className="about-value__icon">
                  <Icon name={v.icon} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Zertifizierung */}
      <section className="section certificate">
        <div className="container">
          <Reveal className="certificate__card card">
            <ExternalLink
              className="certificate__media"
              href={img.zertifikat}
              aria-label="Verleihungsurkunde in voller Größe ansehen"
            >
              <img
                src={img.zertifikat}
                alt="RAL-Gütezeichen Verleihungsurkunde für Holzernte und Holzrücken – Forstservice Lukas Weiß"
                loading="lazy"
              />
              <span className="certificate__zoom">
                <Icon name="ExternalLink" /> Urkunde ansehen
              </span>
            </ExternalLink>

            <div className="certificate__body">
              <span className="eyebrow">Zertifizierung</span>
              <h2>RAL-Gütezeichen für Holzernte &amp; Holzrücken</h2>
              <p>
                Unser Forstservice ist von der Gütegemeinschaft Wald- und
                Landschaftspflege e.&nbsp;V. mit dem RAL-Gütezeichen 244 „Wald-
                und Landschaftspflege" ausgezeichnet. Das vom RAL – Deutsches
                Institut für Gütesicherung und Kennzeichnung anerkannte
                Gütezeichen steht für unabhängig geprüfte Qualität, fachgerechte
                Ausführung und einen verantwortungsvollen Umgang mit Wald und
                Technik – regelmäßig kontrolliert und verbindlich eingehalten.
              </p>
              <ul className="cert-features">
                <li>
                  <Icon name="BadgeCheck" />
                  <span>
                    <strong>GZ 244/1</strong> – Holzernte
                  </span>
                </li>
                <li>
                  <Icon name="BadgeCheck" />
                  <span>
                    <strong>GZ 244/2</strong> – Holzrücken
                  </span>
                </li>
              </ul>
              <p className="certificate__issuer">
                <Icon name="Award" /> Verliehen durch die Gütegemeinschaft Wald-
                und Landschaftspflege e.&nbsp;V. · RAL-GZ 244
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WEISS-Slogan */}
      <section className="section weiss-slogan">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Unser Versprechen</span>
            <h2>W · E · I · S · S</h2>
          </Reveal>
          <div className="slogan-lines">
            {sloganLines.map((line, i) => (
              <Reveal key={i} delay={i * 0.07} className="slogan-line">
                <span className="slogan-letter">{line.letter}</span>
                <span className="slogan-text">{line.text}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section team">
        <div className="container team__content">
          <Reveal className="team__text">
            <span className="eyebrow">Unser Team</span>
            <h2>Familienbetrieb mit Leidenschaft</h2>
            <p>
              Die Weiß Forst GbR steht als Familienbetrieb für persönliche
              Betreuung und direkten Austausch mit unseren Kunden. Durch unsere
              klare, familiäre Struktur gewährleisten wir kurze
              Entscheidungswege und eine flexible, kundenorientierte
              Arbeitsweise.
            </p>
            <p>
              Für unsere Arbeit setzen wir auf modernste Maschinen und Technik.
              Ob Waldpflege, Holzernte oder Beratung – wir verbinden moderne
              Technologie mit nachhaltigen Lösungen, die langfristig überzeugen.
            </p>
            <p>
              Wir sind nicht nur Dienstleister, sondern Partner, die mit Ihnen
              gemeinsam die beste Lösung für Ihren Wald finden.
            </p>
            <blockquote className="team__quote">
              <Icon name="Quote" />
              <p>
                „Verantwortung für die Wälder – für heute und kommende
                Generationen."
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
