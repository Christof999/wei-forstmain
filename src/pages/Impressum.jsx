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
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            Diese Website{' '}
            <a href="https://www.weiss-forst.de" target="_blank" rel="noreferrer">
              www.weiss-forst.de
            </a>{' '}
            ist ein gemeinsames Onlineangebot der nachfolgend genannten
            Unternehmen.
          </p>

          <h3>Matthias u. Silke Weiß Forst GbR</h3>
          <p>
            Gesellschaft bürgerlichen Rechts
            <br />
            Heglauer Straße 7
            <br />
            91732 Merkendorf
            <br />
            Bayern, Deutschland
          </p>
          <p>
            <strong>Vertreten durch:</strong> Matthias Weiß und Silke Weiß
            <br />
            <strong>Telefon:</strong>{' '}
            <a href="tel:+4915154659796">0151 54659796</a>
            <br />
            <strong>E-Mail:</strong>{' '}
            <a href="mailto:L.Weiss-Forstservice@gmx.de">
              L.Weiss-Forstservice@gmx.de
            </a>
          </p>

          <h3>Forstservice Lukas Weiß</h3>
          <p>
            Einzelunternehmen
            <br />
            <strong>Firmeninhaber:</strong> Lukas Weiß
            <br />
            Heglauer Straße 7
            <br />
            91732 Merkendorf
            <br />
            Bayern, Deutschland
          </p>
          <p>
            <strong>Telefon:</strong>{' '}
            <a href="tel:+491747468091">0174 7468091</a>
            <br />
            <strong>E-Mail:</strong>{' '}
            <a href="mailto:l.weiss-Forstservice@gmx.de">
              l.weiss-Forstservice@gmx.de
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
            <strong>Steuer-Nr. (Matthias u. Silke Weiß Forst GbR):</strong>{' '}
            203 / 286 / 61404
            <br />
            <strong>Steuer-Nr. (Forstservice Lukas Weiß):</strong> 203 / 286 /
            61420
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Matthias Weiß und Silke Weiß (Matthias u. Silke Weiß Forst GbR)
            <br />
            Lukas Weiß (Forstservice Lukas Weiß)
            <br />
            Heglauer Straße 7, 91732 Merkendorf
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die
            auf eine rechtswidrige Tätigkeit hinweisen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
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
