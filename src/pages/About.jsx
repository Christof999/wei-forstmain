import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { values, sloganLines, img } from '../data/site.js'
import './About.css'

export default function About() {
  return (
    <PageTransition>
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
        <div className="container team__grid">
          <Reveal className="team__image">
            <img src={img.team} alt="Weiß Forst Team bei der Arbeit" loading="lazy" />
          </Reveal>
          <Reveal delay={0.1} className="team__text">
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
