import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'

const STAND = '15. Juni 2026'

export default function Barrierefreiheit() {
  return (
    <PageTransition>
      <Seo path="/barrierefreiheit" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Rechtliches</span>
          <h1>Erklärung zur Barrierefreiheit</h1>
          <p>
            Diese Erklärung gilt für die Website{' '}
            <a href="https://www.weiss-forst.de">www.weiss-forst.de</a>.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container prose">
          <h2>Stand der Erklärung</h2>
          <p>
            Diese Erklärung wurde am <strong>{STAND}</strong> erstellt und zuletzt
            am <strong>{STAND}</strong> überprüft.
          </p>

          <h2>Anwendbare Vorschriften</h2>
          <p>
            Diese Website orientiert sich an den Anforderungen des
            Barrierefreiheitsstärkungsgesetzes (BFSG) in Verbindung mit der
            harmonisierten Norm <strong>EN 301 549 V3.2.1</strong>, die auf den
            Web Content Accessibility Guidelines (<strong>WCAG 2.1</strong>)
            Level AA verweist.
          </p>

          <h2>Anbieter</h2>
          <p>
            Matthias u. Silke Weiß Forst GbR
            <br />
            Forstservice Lukas Weiß (Einzelunternehmen)
            <br />
            Heglauer Straße 7, 91732 Merkendorf
          </p>

          <h2>Stand der Vereinbarkeit</h2>
          <p>
            Diese Website ist <strong>weitgehend vereinbar</strong> mit EN 301
            549 V3.2.1 / WCAG 2.1 Level AA. Bekannte Einschränkungen werden
            fortlaufend verbessert.
          </p>

          <h2>Umgesetzte Maßnahmen</h2>
          <ul>
            <li>Semantische HTML-Struktur mit Landmarks und Überschriften</li>
            <li>Skip-Link „Zum Inhalt springen“</li>
            <li>Tastaturbedienbarkeit mit sichtbarem Fokus</li>
            <li>Textalternativen für Bilder und beschreibende Link-Texte</li>
            <li>Barrierefreies Kontaktformular mit Fehler-Feedback</li>
            <li>Fokus-Management in Dialogen (Menü, Lightbox, Cookie-Einstellungen)</li>
            <li>Steuerung des Hintergrundvideos und Berücksichtigung von „Bewegung reduzieren“</li>
            <li>Einwilligungsbasiertes Laden externer Inhalte (Google Fonts, Google Maps)</li>
          </ul>

          <h2>Bekannte Einschränkungen</h2>
          <ul>
            <li>
              Einige ältere Galeriebilder verfügen nur über allgemeine
              Bildbeschreibungen, bis individuelle Texte ergänzt werden.
            </li>
            <li>
              Externe Dienste (Google Maps, Google Fonts) unterliegen den
              Barrierefreiheitsstandards der jeweiligen Anbieter.
            </li>
          </ul>

          <h2>Erstellung dieser Erklärung</h2>
          <p>
            Die Bewertung erfolgte durch eine interne Selbstbewertung auf
            Grundlage einer technischen Überprüfung des Quellcodes und gängiger
            Prüfverfahren.
          </p>

          <h2>Feedback und Kontakt</h2>
          <p>
            Sollten Ihnen Mängel in der Barrierefreiheit dieser Website
            auffallen, senden Sie uns bitte eine Nachricht:
          </p>
          <p>
            <strong>E-Mail:</strong>{' '}
            <a href="mailto:l.weiss-Forstservice@gmx.de">l.weiss-Forstservice@gmx.de</a>
            <br />
            <strong>Telefon:</strong>{' '}
            <a href="tel:+491747468091">0174 7468091</a>
            <br />
            <strong>Post:</strong> Heglauer Straße 7, 91732 Merkendorf
          </p>
          <p>
            Alternativ können Sie unser{' '}
            <a href="/kontakt">Kontaktformular</a> nutzen.
          </p>

          <h2>Durchsetzungsverfahren</h2>
          <p>
            Wenn Sie der Ansicht sind, nicht ausreichend auf eine Mitteilung
            oder Anfrage zur Barrierefreiheit reagiert zu haben, können Sie sich
            an die zuständige Marktüberwachungsbehörde wenden:
          </p>
          <p>
            Bayerisches Landesamt für Maß und Gewerbeaufsicht (LMG)
            <br />
            Ständlerstraße 22
            <br />
            90763 Fürth
            <br />
            Website:{' '}
            <a
              href="https://www.lmg.bayern.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.lmg.bayern.de
              <span className="visually-hidden"> (öffnet in neuem Tab)</span>
            </a>
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
