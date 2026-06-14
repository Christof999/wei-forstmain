import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'

export default function Datenschutz() {
  return (
    <PageTransition>
      <Seo path="/datenschutz" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Rechtliches</span>
          <h1>Datenschutzerklärung</h1>
        </div>
      </header>

      <section className="section">
        <div className="container prose">
          <p>
            Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und
            Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend kurz
            „Daten") im Rahmen der Erbringung unserer Leistungen sowie innerhalb
            unseres Onlineangebotes und der mit ihm verbundenen Webseiten,
            Funktionen und Inhalte auf. Im Hinblick auf die verwendeten
            Begrifflichkeiten verweisen wir auf die Definitionen in Art. 4 der
            Datenschutzgrundverordnung (DSGVO).
          </p>

          <h2>Verantwortlicher</h2>
          <p>
            WinWood
            <br />
            Matthias und Silke Weiß Forst GbR
            <br />
            Heglauer Straße 7
            <br />
            91732 Merkendorf
            <br />
            E-Mail: L.Weiss-Forstservice@gmx.de
          </p>

          <h2>Arten der verarbeiteten Daten</h2>
          <ul>
            <li>Bestandsdaten (z.B. Namen, Adressen).</li>
            <li>Kontaktdaten (z.B. E-Mail, Telefonnummern).</li>
            <li>Inhaltsdaten (z.B. Texteingaben, Fotografien).</li>
            <li>Nutzungsdaten (z.B. besuchte Webseiten, Zugriffszeiten).</li>
            <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen).</li>
          </ul>

          <h2>Zweck der Verarbeitung</h2>
          <ul>
            <li>Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte.</li>
            <li>Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern.</li>
            <li>Sicherheitsmaßnahmen.</li>
          </ul>

          <h2>Kontaktaufnahme</h2>
          <p>
            Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail
            oder Telefon) werden die Angaben des Nutzers zur Bearbeitung der
            Kontaktanfrage und deren Abwicklung gem. Art. 6 Abs. 1 lit. b. DSGVO
            verarbeitet. Anfragen über das Kontaktformular werden bei unserem
            Dienstleister Google Firebase (Google Ireland Ltd.) gespeichert.
          </p>

          <h2>Rechte der betroffenen Personen</h2>
          <p>
            Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob
            betreffende Daten verarbeitet werden und auf Auskunft über diese
            Daten sowie auf weitere Informationen und Kopie der Daten
            entsprechend Art. 15 DSGVO.
          </p>

          <h2>Widerrufs- und Widerspruchsrecht</h2>
          <p>
            Sie haben das Recht, erteilte Einwilligungen mit Wirkung für die
            Zukunft zu widerrufen. Sie können der künftigen Verarbeitung der Sie
            betreffenden Daten nach Maßgabe der gesetzlichen Vorgaben jederzeit
            widersprechen.
          </p>

          <h2>Löschung von Daten</h2>
          <p>
            Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen
            Vorgaben gelöscht, sobald die zu ihrer Verarbeitung erteilten
            Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen.
          </p>

          <h2>Google Maps</h2>
          <p>
            Wir binden die Landkarten des Dienstes „Google Maps" des Anbieters
            Google LLC ein. Zu den verarbeiteten Daten können insbesondere
            IP-Adressen und Standortdaten der Nutzer gehören.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
