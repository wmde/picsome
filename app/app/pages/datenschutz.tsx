import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import Content from "app/core/components/Content"
import { UT, T } from "@transifex/react"

const PrivacyPolicy: BlitzPage = (props: any) => {
  return (
    <Grid>
      <Content>
        <h1>
          <T _str="Datenschutz" />
        </h1>
        <UT
          _str={`<h2>1. Datenschutz auf einen Blick</h2>

        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten
          sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche
          Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
          Datenschutzerklärung.
        </p>

        <h3>Datenerfassung auf unserer Website</h3>

        <h3>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
          Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
        </p>

        <h3>Wie erfassen wir Ihre Daten?</h3>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es
          sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
        </p>
        <p>
          Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
          Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit
          des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere
          Website betreten.
        </p>

        <h3>Wofür nutzen wir Ihre Daten?</h3>
        <p>
          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
          gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
        </p>

        <h3>Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
        <p>
          Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
          Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
          Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren
          Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen
          Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
          Aufsichtsbehörde zu.
        </p>

        <h3>Analyse-Tools und Tools von Drittanbietern</h3>
        <p>
          Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das
          geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Die Analyse Ihres
          Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten kann nicht zu Ihnen
          zurückverfolgt werden. Sie können dieser Analyse widersprechen oder sie durch die
          Nichtbenutzung bestimmter Tools verhindern. Detaillierte Informationen dazu finden Sie in
          der folgenden Datenschutzerklärung.Sie können dieser Analyse widersprechen. Über die
          Widerspruchsmöglichkeiten werden wir Sie in dieser Datenschutzerklärung informieren.
        </p>

        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>

        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
          behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        <p>
          Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
          Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
          Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie
          nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
        </p>
        <p>
          Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation
          per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem
          Zugriff durch Dritte ist nicht möglich.
        </p>

        <h3>Hinweis zum Verantwortlichen</h3>
        <p>Der Verantwortliche für die Datenverarbeitung auf dieser Website ist:</p>
        <p>
          Wikimedia Deutschland – Gesellschaft zur Förderung Freien Wissens e. V.
          <br />
          Tempelhofer Ufer 23-24
          <br />
          10963 Berlin
          <br />
          Telefon: +49 (0)30-577 11 62-0
          <br />
          E-Mail: datenschutz@wikimedia.de
        </p>

        <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
        <p>
          Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
          Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine
          formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
          Datenverarbeitung bleibt vom Widerruf unberührt.
        </p>

        <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
        <p>
          Im Falle datenschutzrechtlicher Verstöße steht dem Betroffenen ein Beschwerderecht bei der
          zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde in datenschutzrechtlichen
          Fragen ist der Landesdatenschutzbeauftragte des Bundeslandes, in dem unser Unternehmen
          seinen Sitz hat. Eine Liste der Datenschutzbeauftragten sowie deren Kontaktdaten können
          folgendem Link entnommen werden:
          https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html
        </p>

        <h3>Recht auf Datenübertragbarkeit</h3>
        <p>
          Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
          eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen,
          maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der
          Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
          machbar ist.
        </p>

        <h3>SSL- bzw. TLS-Verschlüsselung</h3>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
          Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber
          senden, eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
          daran, dass die Adresszeile des Browsers von “http://” auf “https://” wechselt und an dem
          Schloss-Symbol in Ihrer Browserzeile.
        </p>
        <p>
          Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns
          übermitteln, nicht von Dritten mitgelesen werden.
        </p>

        <h3>Auskunft, Einschränkung der Verarbeitung, Löschung</h3>
        <p>
          Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
          unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft
          und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung,
          Einschränkung der Verarbeitung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen
          zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum
          angegebenen Adresse an uns wenden.
        </p>

        <h3>Automatisierte Entscheidungsfindung</h3>
        <p>
          Wir verwenden keine automatisierte Entscheidungsfindung einschließlich Profiling gemäß
          Artikel 22 Abs. 1 und 4 DS-GVO.
        </p>

        <h3>Pflicht zur Bereitstellung von Daten</h3>
        <p>
          Sie sind in keinem Fall gesetzlich oder vertraglich dazu verpflichtet, uns
          personenbezogene Daten bereitzustellen. Ohne die Bereitstellung im Rahmen der unten
          angegebenen Dienstleistungen, können wir Ihnen die dort beschriebenen Funktionen aber
          nicht zur Verfügung stellen.
        </p>

        <h2>3. Datenschutzbeauftragter</h2>
        <h3>Gesetzlich vorgeschriebener Datenschutzbeauftragter</h3>
        <p>Wir haben für unser Unternehmen einen Datenschutzbeauftragten bestellt.</p>

        <p>
          Thorsten Feldmann, LL.M.
          <br />
          JBB Rechtsanwälte Jaschinski Biere Brexl Partnerschaft mbB
          <br />
          Christinenstr. 18/19
          <br />
          10119 Berlin
          <br />
          Telefon: +49 30 443 765 0<br />
          E-Mail: datenschutz@wikimedia.de
        </p>

        <h2>4. Datenerfassung auf unserer Website</h2>
        <h3>Cookies</h3>
        <p>
          Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem
          Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot
          nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien,
          die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
        </p>
        <p>
          Die meisten der von uns verwendeten Cookies sind so genannte “Session-Cookies”. Sie werden
          nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät
          gespeichert bis Sie diese löschen. Diese Cookies ermöglichen es uns, Ihren Browser beim
          nächsten Besuch wiederzuerkennen.
        </p>
        <p>
          Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
          werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle
          oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des
          Browsers aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser
          Website eingeschränkt sein.
        </p>
        <p>
          Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs oder zur
          Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z. B. Warenkorbfunktion)
          erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert. Der
          Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von Cookies zur
          technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. Soweit andere
          Cookies (z. B. Cookies zur Analyse Ihres Surfverhaltens) gespeichert werden, werden diese
          in dieser Datenschutzerklärung gesondert behandelt.
        </p>

        <h3>Server-Log-Dateien</h3>
        <p>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
          Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
        </p>
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>

        <p>Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>
        <p>
          Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, der die Verarbeitung
          von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet. Eine
          Speicherung erfolgt nur für den Zeitraum von 24 Stunden. Anschließend erfolgt eine
          automatische Löschung aller von unseren Systemen erstellten Log-Files.
        </p>

        <h3>Registrierung auf dieser Website</h3>
        <p>
          Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen auf der Seite
          zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des
          jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der
          Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Andernfalls
          werden wir die Registrierung ablehnen.
        </p>
        <p>
          Für systembedingte Mitteilungen, wie z. B. die Zusendung von Login-Links, wichtige
          Änderungen etwa beim Angebotsumfang oder bei technisch notwendigen Änderungen nutzen wir
          die bei der Registrierung angegebene E-Mail-Adresse, um Sie auf diesem Wege zu
          informieren. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange Sie auf unserer
          Website registriert sind und werden anschließend gelöscht. Gesetzliche Aufbewahrungsfristen bleiben unberührt.
        </p>
        <p>
          Zur Löschung Ihrer Registrierung reicht eine formlose Mitteilung per E-Mail mit dem
          Betreff “Kontolöschung” an <a href="mailto:picsome@wikimedia.de">picsome@wikimedia.de</a>. Die Rechtmäßigkeit der bereits
          erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
        </p>

        <h3>Nutzer*innen Feedback (Usersnap)</h3>
        <p>
          Diese Webanwendung verwendet Usersnap, eine von der Usersnap GmbH, Industriezeile 35, 4020
          Linz, ("Usersnap") in unserem Auftrag bereitgestellte Benutzer-Feedback-Lösung, durch
          Einbindung des Web-Snippets von Usersnap. Bei Nutzung der Benutzer-Feedback-Lösung werden
          Informationen über Ihre Nutzung unserer Webanwendung an Usersnap übermittelt. Dabei
          handelt es sich um die folgenden Informationen:
        </p>

        <ul>
          <li>Betriebssystem</li>
          <li>Browser Version</li>
          <li>Bildschirmauflösung</li>
          <li>URL</li>
          <li>
            Optional: die von Ihnen der Kommunikation hinzugefügten Kommentare, Bewertungen,
            Rückmeldungen, Screenshots, etc.
          </li>
          <li>
            Optional: die von Ihnen der Kommunikation hinzugefügten Kontaktmöglichkeiten, z.B.
            Username oder E-Mail-Adresse
          </li>
        </ul>

        <p>
          Usersnap verwendet die automatisch gesammelten Informationen, um manuell eingereichten
          Feedbacks von Nutzer*innen Kontextinformationen hinzuzufügen, um Feedback-Elemente zu
          analysieren und um Berichte im Dashboard von Usersnap zu erstellen.
        </p>

        <h4>Speicherdauer der Kommunikations- und Metadaten</h4>
        <p>
          Die mittels Usersnap im Rahmen der Sammlung von Kommentaren und Rückmeldungen erhaltenen
          personenbezogenen Daten werden nach max. 2 Jahren gelöscht.
        </p>

        <h4>Rechtsgrundlage</h4>
        <p>
          Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes
          Interesse besteht in der Dokumentation und Nachverfolgung der Rückmeldungen.
        </p>

        <h3>Interviews</h3>
        <p>
          Wenn Sie dies wünschen können wir mit Ihnen nach Absprache Interviews führen, in denen Sie
          uns Ihre Erfahrungen mit unseren Angeboten und Diensten schildern können. Diese Interviews
          erfolgen online auf die technische Art und Weise, die wir in der Vorkorrespondenz
          verabredet haben (z. B. über Big Blue Button, Google Hangouts etc.). Wir machen hierbei
          ggf. schriftliche Notizen, die wir nach einem Zeitraum von einem Monat anonymisieren. Wenn
          Sie zuvor ausdrücklich zugestimmt haben, zeichnen wir das Interview auch auf.
        </p>

        <h4>Speicherdauer der Kommunikations- und Metadaten</h4>
        <p>
          Wenn Sie der Aufzeichnung des Interviews zugestimmt haben, erfolgt Im Anschluss innerhalb
          von vier Wochen eine Transkription. Die Aufzeichnung selbst wird nach einer Transkription
          unverzüglich gelöscht und aus dieser werden sämtliche Personenbezüge entfernt. Sofern wir
          die Aufzeichnung länger aufbewahren möchten, stimmen wir dies im Einzelfall mit Ihnen
          vorher ab. Die anonymisierten Transkriptionen sowie unsere Notizen werden wir langfristig
          speichern und archivieren.
        </p>

        <h4>Rechtsgrundlage</h4>
        <p>
          Die Verwendung der Interviews zu Verbesserungs- und Optimierungszwecken stellt das
          berechtigte Interesse an der zu diesen Zwecken erfolgenden Datenverarbeitung dar. Die
          Rechtsgrundlage ist daher Art. 6 Abs. 1 lit. f) DSGVO.
        </p>

        <p>
          Die Rechtsgrundlage für die Anfertigung und Verarbeitung der Videodateien ist ebenfalls
          Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes Interesse besteht in der Dokumentation und
          Archivierung der Interviews.
        </p>

        <h3>Newsletter</h3>
        <p>
          Sie haben an verschiedenen Stellen die Möglichkeit, sich für einen unserer Newsletter zu
          registrieren. In diesem Fall verwenden wir Ihre E-Mailadresse, um Ihnen Informationen über
          aktuelle Themen und unsere Arbeit zuzusenden. Die Rechtsgrundlage für die Verarbeitungen
          ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a) DSGVO). Ihre Einwilligung können Sie
          jederzeit mit Wirkung für die Zukunft widerrufen, z. B. per E-Mail an <a href="mailto:news@wikimedia.de">news@wikimedia.de</a>
          oder indem Sie auf einen Abmeldelink in einer der Ihnen zugesendeten E-Mails klicken.
          Durch den Widerruf wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf
          vorgenommenen Verarbeitungen nicht berührt.
        </p>
        <p>
          Wir analysieren zudem Ihre Nutzung unseres Newsletters, z. B. auf welchen Link oder
          welchen Button Sie geklickt haben. Dies dient zur Verbesserung unserer Angebote.
        </p>
        <p>
          Die Verarbeitungen zu diesen Zwecken beruhen auf Art. 6 Abs. 1 lit. f) DSGVO, wobei unser
          berechtigtes Interesse in den vorgenannten Zwecken liegt. Wenn Sie mit der Analyse nicht
          einverstanden sind, können Sie jederzeit widersprechen, indem Sie die E-Mails abbestellen.
        </p>

        <h2>5. Analyse Tools und Werbung</h2>
        <h3>Matomo (ehemals Piwik)</h3>
        <p>
          Diese Website benutzt den Open Source Webanalysedienst Matomo. Wir setzen Matomo in einer
          Variante mit Cookies und einer Varianten ohne Cookies ein. Beide Varianten sammeln gewisse
          Informationen von Ihnen, um unsere Website zu optimieren und zu verbessern.
        </p>
          
        <p>
        Wir verwenden zudem die Funktion “Event tracking” und “Custom Dimensions” welche Interaktionen mit Elementen der Anwendung analysiert und uns so besonders nützliche Informationen zur Nutzung der Seite liefert. Für diese Zwecke werden die durch den Cookie erzeugten Informationen über die Benutzung dieser Website gesammelt und auf unserem Server gespeichert. 
        </p>

        <p>
        Wir haben Matomo so konfiguriert, dass Daten automatisch anonymisiert werden, so dass keine persönlichen Daten verarbeitet werden. Die IP-Adresse wird vor der Speicherung gekürzt, so dass von vornherein kein Rückschluss auf Sie als Person möglich ist.
        </p>

        <p>
        Optionale Cookies werden nur mit Ihrer Zustimmung gesetzt, die Sie uns über unser Cookie-Management erteilen können. Dort können Sie Ihre Zustimmung auch jederzeit widerrufen. 
        </p>

        <p>
        Die Speicherdauer der Cookies beträgt 30 Minuten bzw. 13 Monate. Matomo wird auf unseren eigenen Servern betrieben, die Informationen über die Benutzung dieser Website werden auch nicht anderweitig an Dritte weitergegeben.
        </p>

        <p>
        Die Verarbeitungen im Rahmen der Variante ohne Cookies finden ohne Ihre Einwilligung aufgrund unseres berechtigten Interesses an den genannten Zwecken statt (Art. 6 Abs. 1 lit. f) DSGVO). Selbstverständlich können Sie hier Ihren Widerspruch erklären, indem Sie auf den folgenden Link klicken.
        </p>

        <p>
        Sie können diese Anwendung daran hindern, die von Ihnen durchgeführten Aktionen zu sammeln und zu analysieren. Dadurch wird Ihre Privatsphäre geschützt, aber auch verhindert, dass der Betreiber der Anwendung aus Ihren Aktionen lernt und eine bessere Nutzererfahrung für Sie und andere schafft.
        </p>

        <iframe
          style="border:0; height: 200px; width: 600px; max-width: 100%;"
          src="https://stats.wikimedia.de/index.php?module=CoreAdminHome&action=optOut&language=de&backgroundColor=&fontColor=&fontSize=&fontFamily="
        ></iframe>

        <h2>6. Sonstige Empfänger</h2>
        <p>
          Innerhalb von Wikimedia haben jeweils die Abteilungen auf Ihre Daten Zugriff, die für die
          Bearbeitung der Anliegen zuständig sind. Zudem setzen wir externe Dienstleister ein,
          soweit wir Leistungen nicht oder nicht sinnvoll selbst vornehmen können. Diese externen
          Dienstleister sind dabei vor allem Anbieter von IT-Dienstleistungen und
          Telekommunikationsdienste. Soweit die gesetzlichen Voraussetzungen vorliegen, haben wir
          mit diesen Dienstleistern Auftragsverarbeitungsverträge geschlossen.
        </p>
        <p>
          Eine Übermittlung in Drittstaaten findet grundsätzlich nicht statt. Wir nutzen allerdings
          den Dienst Google Workspaceder Google LLC („Google“), 1600 Amphitheatre Parkway, Mountain
          View, CA 94043, USA für unsere Arbeitsabläufe. Ein angemessenes Datenschutzniveau ist
          durch die Standardvertragsklauseln sichergestellt.
        </p>
        <h4>Abschluss eines Vertrags über Auftragsdatenverarbeitung</h4>
        <p>
          Wir haben mit unserem Dienstleister einen Vertrag abgeschlossen, in dem wir diesen
          verpflichten, die Daten unserer Kunden zu schützen und sie nicht an Dritte weiterzugeben.
        </p>
        <h4>Büro</h4>
        <p>
          Wikimedia Deutschland
          <br />
          Gesellschaft zur Förderung Freien Wissens e. V.
          <br />
          Postfach 61 03 49
          <br />
          10925 Berlin
        </p>

        <p>
          Verantwortlicher ist die natürliche oder juristische Person, die allein oder gemeinsam mit
          anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B.
          Namen, E-Mail-Adressen o. Ä.) entscheidet.
        </p>
        <p>Telefon: +49 (0)30-577 11 62-0</p>
        <p>Fax: +49 (0)30-577 11 62-99</p>
        <p>E-Mail: <a href="mailto:info@wikimedia.de">info@wikimedia.de</a></p>`}
        />
      </Content>
    </Grid>
  )
}

export const getServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

PrivacyPolicy.suppressFirstRenderFlicker = true
PrivacyPolicy.getLayout = (page) => <Layout title="Datenschutz">{page}</Layout>

export default PrivacyPolicy
