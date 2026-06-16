import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ExternalLink from '../components/ExternalLink.jsx'

const STAND = '15. Juni 2026'

export default function Datenschutz() {
  return (
    <PageTransition>
      <Seo path="/datenschutz" />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Rechtliches</span>
          <h1>Datenschutzerklärung</h1>
          <p>
            Informationen zur Verarbeitung personenbezogener Daten auf{' '}
            <a href="https://www.weiss-forst.de">www.weiss-forst.de</a> gemäß der
            Datenschutz-Grundverordnung (DSGVO).
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container prose">
          <p>
            <strong>Stand:</strong> {STAND}
          </p>
          <p>
            Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck
            der Verarbeitung personenbezogener Daten (nachfolgend „Daten") bei
            Nutzung unseres Onlineangebotes. Maßgeblich sind die Definitionen in
            Art. 4 DSGVO.
          </p>

          <h2>1. Verantwortliche</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website sind:
          </p>
          <p>
            <strong>Matthias u. Silke Weiß Forst GbR</strong>
            <br />
            Gesellschaft bürgerlichen Rechts
            <br />
            Heglauer Straße 7, 91732 Merkendorf
            <br />
            Telefon: <a href="tel:+4915154659796">0151 54659796</a>
            <br />
            E-Mail:{' '}
            <a href="mailto:L.Weiss-Forstservice@gmx.de">L.Weiss-Forstservice@gmx.de</a>
          </p>
          <p>
            <strong>Forstservice Lukas Weiß</strong> (Einzelunternehmen)
            <br />
            Inhaber: Lukas Weiß
            <br />
            Heglauer Straße 7, 91732 Merkendorf
            <br />
            Telefon: <a href="tel:+491747468091">0174 7468091</a>
            <br />
            E-Mail:{' '}
            <a href="mailto:l.weiss-Forstservice@gmx.de">l.weiss-Forstservice@gmx.de</a>
          </p>
          <p>
            Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen
            Voraussetzungen hierfür nicht vorliegen.
          </p>

          <h2>2. Arten der verarbeiteten Daten</h2>
          <ul>
            <li>Bestands- und Kontaktdaten (z. B. Name, Telefonnummer, E-Mail-Adresse)</li>
            <li>Inhaltsdaten (z. B. Nachrichtentext im Kontaktformular)</li>
            <li>Nutzungsdaten (z. B. besuchte Seiten, Zugriffszeitpunkt)</li>
            <li>Meta-/Kommunikationsdaten (z. B. IP-Adresse, Browsertyp, Betriebssystem)</li>
            <li>Ihre Einwilligungsentscheidungen zu optionalen Diensten</li>
          </ul>

          <h2>3. Zwecke und Rechtsgrundlagen</h2>
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies zur
            Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte
            und Leistungen erforderlich ist. Die Verarbeitung erfolgt auf
            folgenden Rechtsgrundlagen:
          </p>
          <ul>
            <li>
              <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – zur Bearbeitung von
              Kontaktanfragen und vorvertraglicher Kommunikation
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – berechtigtes Interesse
              an sicherem, stabilem Betrieb der Website (Hosting, Logfiles,
              technische Bereitstellung von Inhalten)
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Ihre Einwilligung zu
              optionalen Diensten (Google Fonts, Google Maps)
            </li>
          </ul>

          <h2>4. Hosting (Vercel)</h2>
          <p>
            Diese Website wird bei der <strong>Vercel Inc.</strong>, 340 S Lemon
            Ave #4133, Walnut, CA 91789, USA, gehostet. Beim Aufruf werden
            automatisch Server-Logdaten erhoben (u. a. IP-Adresse, Datum/Uhrzeit
            des Zugriffs, angeforderte Datei, Browsertyp und Betriebssystem).
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an zuverlässigem Betrieb).
            <br />
            <strong>Speicherdauer:</strong> gemäß den Vorgaben des Hosters, in der
            Regel wenige Wochen.
            <br />
            <strong>Auftragsverarbeitung:</strong> Mit Vercel besteht ein
            Auftragsverarbeitungsvertrag (AVV) einschließlich
            Standardvertragsklauseln für Übermittlungen in die USA.
            <br />
            Weitere Informationen:{' '}
            <ExternalLink href="https://vercel.com/legal/privacy-policy">
              Datenschutzerklärung von Vercel
            </ExternalLink>
          </p>

          <h2>5. Firebase (Google) – Kontaktformular, Galerie, Beiträge</h2>
          <p>
            Für das Kontaktformular, die dynamische Galerie und optionale
            Beiträge nutzen wir Dienste der{' '}
            <strong>Google Ireland Limited</strong> (Gordon House, Barrow Street,
            Dublin 4, Irland) über <strong>Google Firebase</strong> (Firestore
            Database und Cloud Storage, Region EU).
          </p>
          <p>
            <strong>Kontaktanfragen:</strong> Name, Telefonnummer, E-Mail-Adresse
            und Nachrichtentext werden in Firestore gespeichert. Zur internen
            Benachrichtigung wird die Anfrage-ID an unsere separate
            Admin-Anwendung unter{' '}
            <ExternalLink href="https://weiss-admin.vercel.app">
              weiss-admin.vercel.app
            </ExternalLink>{' '}
            (ebenfalls Vercel Inc., USA) übermittelt.
          </p>
          <p>
            <strong>Galerie und Beiträge:</strong> Beim Laden von Bildern oder
            Beiträgen stellt Ihr Browser eine Verbindung zu Firebase/Google her;
            dabei kann Ihre IP-Adresse verarbeitet werden.
          </p>
          <p>
            <strong>Rechtsgrundlage Kontakt:</strong> Art. 6 Abs. 1 lit. b DSGVO.
            <br />
            <strong>Rechtsgrundlage Galerie/Beiträge:</strong> Art. 6 Abs. 1 lit.
            f DSGVO (berechtigtes Interesse an Darstellung unseres Angebots).
            <br />
            <strong>Speicherdauer Kontaktanfragen:</strong> maximal 12 Monate nach
            Abschluss der Anfrage, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
            <br />
            <strong>Auftragsverarbeitung:</strong> Mit Google/Firebase besteht ein
            AVV gemäß den Firebase-/Google-Cloud-Bedingungen.
            <br />
            Weitere Informationen:{' '}
            <ExternalLink href="https://policies.google.com/privacy">
              Datenschutzerklärung von Google
            </ExternalLink>
          </p>

          <h2>6. Bildauslieferung (Amazon Web Services &amp; Firebase Storage)</h2>
          <p>
            Einzelne Bilder werden über{' '}
            <strong>Amazon Web Services (AWS)</strong> in der Region EU
            (eu-central-1, Frankfurt) sowie über{' '}
            <strong>Firebase Storage</strong> (Google) ausgeliefert. Dabei werden
            technisch erforderliche Verbindungsdaten (u. a. IP-Adresse)
            verarbeitet.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
            <br />
            <strong>Auftragsverarbeitung:</strong> Mit den jeweiligen Anbietern
            bestehen die üblichen Vertragsbedingungen zur Auftragsverarbeitung.
          </p>

          <h2>7. Kontaktaufnahme</h2>
          <p>
            Bei Kontakt per Formular, E-Mail oder Telefon verarbeiten wir die von
            Ihnen mitgeteilten Daten ausschließlich zur Bearbeitung Ihrer Anfrage.
            Die Angabe der Daten ist zur Bearbeitung erforderlich; ohne diese
            Daten können wir Ihre Anfrage nicht bearbeiten.
          </p>
          <p>
            Sofern Sie das Kontaktformular nutzen, werden Ihre Eingaben in
            Firebase gespeichert (siehe Abschnitt 5). Alternativ können Sie uns
            auch direkt per E-Mail oder Telefon kontaktieren.
          </p>

          <h2>8. Einwilligung &amp; Cookie-Einstellungen</h2>
          <p>
            Optionale Inhalte (Google Fonts, Google Maps) werden erst nach Ihrer
            ausdrücklichen Einwilligung geladen. Ihre Entscheidung speichern wir
            lokal im Browser (<code>localStorage</code>, Schlüssel{' '}
            <code>wf_consent_v1</code>), damit Ihre Wahl bei künftigen Besuchen
            berücksichtigt wird. Diese Speicherung dient ausschließlich der
            Umsetzung Ihrer Einwilligung und erfolgt ohne Datenübermittlung an
            Dritte.
          </p>
          <p>
            <strong>Rechtsgrundlage optionaler Dienste:</strong> Art. 6 Abs. 1
            lit. a DSGVO.
            <br />
            <strong>Rechtsgrundlage Consent-Speicherung:</strong> Art. 6 Abs. 1
            lit. f DSGVO (berechtigtes Interesse, Ihre Wahl zu dokumentieren) bzw.
            § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich zur Speicherung Ihrer
            Einwilligung).
          </p>
          <p>
            Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
            über „Cookie-Einstellungen" im Seitenfuß widerrufen oder anpassen.
          </p>

          <h2>9. Schriftarten (Google Fonts)</h2>
          <p>
            Zur einheitlichen Darstellung können Schriftarten („Google Fonts") von
            Google geladen werden – <strong>ausschließlich nach Ihrer
            Einwilligung</strong>. Dabei wird Ihre IP-Adresse an Google
            übermittelt. Ohne Einwilligung werden System-Schriftarten verwendet.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO.
          </p>

          <h2>10. Google Maps</h2>
          <p>
            Auf der Kontaktseite kann eine eingebettete Karte von Google Maps
            angezeigt werden – <strong>erst nach Ihrer Einwilligung</strong>. Dabei
            können insbesondere IP-Adresse und ggf. Standortdaten an Google
            (auch in den USA) übermittelt werden.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO.
          </p>

          <h2>11. Keine Profilbildung / kein Tracking</h2>
          <p>
            Wir setzen auf dieser Website <strong>keine</strong> Analyse- oder
            Marketing-Tools (z. B. Google Analytics, Meta Pixel) ein und führen
            keine automatisierte Entscheidungsfindung einschließlich Profiling
            durch.
          </p>

          <h2>12. Speicherdauer</h2>
          <p>
            Personenbezogene Daten werden gelöscht, sobald der Zweck der
            Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen. Kontaktanfragen löschen wir in der Regel nach 12
            Monaten nach Abschluss der Bearbeitung.
          </p>

          <h2>13. Ihre Rechte als betroffene Person</h2>
          <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer Daten:</p>
          <ul>
            <li>
              <strong>Auskunft</strong> über die verarbeiteten Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen Verarbeitung auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)
            </li>
            <li>
              <strong>Widerruf erteilter Einwilligungen</strong> mit Wirkung für
              die Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
          <p>
            Zur Ausübung Ihrer Rechte genügt eine Nachricht an eine der oben
            genannten E-Mail-Adressen.
          </p>

          <h2>14. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren, insbesondere in dem Mitgliedstaat Ihres gewöhnlichen
            Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
            Verstoßes (Art. 77 DSGVO).
          </p>
          <p>
            Zuständige Aufsichtsbehörde für Bayern:
            <br />
            <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>
            <br />
            Promenade 18, 91522 Ansbach
            <br />
            Website:{' '}
            <ExternalLink href="https://www.lda.bayern.de">www.lda.bayern.de</ExternalLink>
          </p>

          <h2>15. Drittlandübermittlungen</h2>
          <p>
            Bei Nutzung von Vercel, Google-Diensten und ggf. AWS kann es zu
            Übermittlungen in Drittländer (insbesondere USA) kommen. Die
            Übermittlung erfolgt auf Grundlage geeigneter Garantien, u. a.
            EU-Standardvertragsklauseln und – soweit anwendbar – dem
            EU-US Data Privacy Framework.
          </p>

          <h2>16. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
            stets den aktuellen rechtlichen Anforderungen entspricht oder
            Änderungen unserer Leistungen abbildet. Es gilt die jeweils auf
            dieser Seite veröffentlichte Fassung.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
