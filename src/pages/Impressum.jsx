import PageTransition from '../components/PageTransition.jsx'

export default function Impressum() {
  return (
    <PageTransition>
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
        </div>
      </section>
    </PageTransition>
  )
}
