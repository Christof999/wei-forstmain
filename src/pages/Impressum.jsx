import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'

export default function Impressum() {
  return (
    <PageTransition>
      <Seo path="/impressum" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Rechtliches</span>
          <h1>Impressum</h1>
        </div>
      </header>

      <section className="section">
        <div className="container prose">
          <p>
            <strong>WINWOOD</strong>
            <br />
            Matthias u. Silke Weiß Forst GbR
            <br />
            Heglauer Straße 7
            <br />
            91732 Merkendorf
          </p>
          <p>
            <strong>Telefon:</strong> 015154659796
            <br />
            <strong>E-Mail:</strong> info@winwood-mw.de
            <br />
            <strong>Website:</strong>{' '}
            <a href="http://www.winwood-mw.de" target="_blank" rel="noreferrer">
              www.winwood-mw.de
            </a>
          </p>

          <h2>Zuständige Kammer</h2>
          <p>
            IHK Nürnberg
            <br />
            Hauptmarkt 22 – 27
            <br />
            90403 Nürnberg
            <br />
            Telefon: (09 11) 13 35 – 0
          </p>

          <h2>Aufsichtsbehörde</h2>
          <p>
            Stadtverwaltung Merkendorf
            <br />
            Marktplatz 1
            <br />
            91732 Merkendorf
            <br />
            Telefon: (0 98 26) 6 50 – 0
          </p>

          <h2>Zuständiges Finanzamt</h2>
          <p>
            Finanzamt Ansbach
            <br />
            <strong>Steuer-Nr.:</strong> 203 / 286 / 61404
          </p>

          <h2>Webdesign &amp; Realisierung</h2>
          <p>
            Konzept, Gestaltung und Umsetzung dieser Website:
            <br />
            <strong>Soergel Design</strong>
            <br />
            <a
              href="https://www.soergel-design.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.soergel-design.de
            </a>
          </p>

          <h2>Hosting</h2>
          <p>
            Diese Website wird gehostet bei der Vercel Inc., 340 S Lemon Ave
            #4133, Walnut, CA 91789, USA. Weitere Informationen zur
            Datenverarbeitung finden Sie in unserer{' '}
            <a href="/datenschutz">Datenschutzerklärung</a>.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
