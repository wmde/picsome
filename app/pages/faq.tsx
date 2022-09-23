import Content from "app/core/components/Content"
import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import { T, UT, useT } from "@transifex/react"
import Accordion from "app/core/components/Accordion"
import AnchorMenu from "app/core/components/AnchorMenu"

const FAQPage: BlitzPage = (props: any) => {
  return (
    <Grid>
      <Content>
        <AnchorMenu
          headline={useT("FAQ")}
          items={[
            { label: useT("Allgemeines"), anchor: "general" },
            { label: useT("Organisatorisches"), anchor: "topics" },
            { label: useT("Praktisches"), anchor: "collections" },
          ]}
        />

        <h2 id="general">
          <T _str="Allgemeine Hinweise zur Nutzung" />
        </h2>

        <Accordion theme="general" title={<T _str="Was genau ist picsome?" />}>
          <p>
            <UT _str="picsome ist ein Projekt von Wikimedia Deutschland e. V. und ist die technische Nachfolgerin des <a href='https://lizenzhinweisgenerator.de/' target='_blank'>Lizenzhinweisgenerators</a>. Mit der neuen Social-Bookmarking-Anwendung <a href='https://www.wikimedia.de/projects/picsome/' target='_blank'>picsome</a> sollen Nutzer*innen nicht mehr nur beim letzten Schritt der Erstellung des Lizenzhinweises unterstützt werden. Vielmehr soll der gesamte Prozess der Suche, Sammlung und lizenzkonformen Nutzung frei lizenzierter Bilder erleichtert werden. picsome richtet sich insbesondere an professionelle Communitys (Lehrende, Blogger*innen, Journalist*innen), die in ihrem beruflichen Alltag viel mit Bildern arbeiten. Die Nutzenden selbst gestalten das Tool mit. Nach dem Prinzip des “User generated Content” schaffen sie eine attraktive Sammlung freier und qualitativ hochwertiger Inhalte. Wie du picsome verwenden kannst, erfährst du in unserer <a href='/my?onboarding=1' target='_blank'>Onboarding Tour.</a>" />
          </p>
        </Accordion>

        <Accordion
          theme="general"
          title={<T _str="Welche Art von Bildern finde ich auf picsome?" />}
        >
          <p>
            <UT _str="Mit picsome kannst du frei lizenzierte Bilder aus den Medienarchiven <a href='https://commons.wikimedia.org/wiki/Hauptseite' target='_blank'>Wikimedia Commons</a> und <a href='https://www.flickr.com/' target='_blank'>Flickr</a> finden, sammeln und teilen. Das heißt es handelt sich um Bilder, deren kostenlose Nutzung und Weiterverbreitung urheberrechtlich ausdrücklich erlaubt und erwünscht ist. Dies ist möglich durch die Verwendung so genannter freier Lizenzen, wie z. B. <a href='https://creativecommons.org/licenses/?lang=de' target='_blank'>Creative-Commons-Lizenzen</a>. Ein gewisser Anteil ist sogar komplett rechtefrei (<a href='https://de.wikipedia.org/wiki/Gemeinfreiheit' target='_blank'>Public Domain</a>). " />
          </p>
          <p>
            <UT _str="Freie Lizenzen bieten den Vorteil, dass die damit lizenzierten Werke eine viel größere Reichweite erzielen können. Viele Nutzungen, wie zum Beispiel Bearbeitungen oder die Weitergabe von Inhalten, sind in diesem Fall dann vorab für alle erlaubt, ohne dass es noch weiterer individueller Absprachen mit den Urheber*innen bedarf – solange die jeweiligen Lizenzbedingungen eingehalten werden. Sie sind daher ein wichtiges Werkzeug, um Informationen und Wissen für möglichst viele Menschen frei zugänglich zu machen." />
          </p>
          <p>
            <UT _str="Eine Übersicht der unterschiedlichen Lizenzbedingungen findest du in der Navigation unter <a href='/about-licenses' target='_blank'>“Über Bildlizenzen”</a>. Wenn du dich ausführlicher über die verschiedenen Creative Commons Lizenzen informieren möchtest, hilft ein Blick in die Broschüre <a href='https://commons.wikimedia.org/wiki/File:Open_Content_-_Ein_Praxisleitfaden_zur_Nutzung_von_Creative-Commons-Lizenzen.pdf' target='_blank'>“Open Content - Ein Praxisleitfaden zur Nutzung von Creative-Commons-Lizenzen“</a>" />
          </p>
        </Accordion>

        <Accordion
          theme="general"
          title={<T _str="Welche Lizenzbedingungen gelten für picsome?" />}
        >
          <p>
            <UT _str="Die Anwendung wurde Open Source entwickelt, das heißt, dass die Software und Infrastruktur offen und frei zugänglich sind. Der gesamte Quellcode des Dienstes wird unter der <a href='https://opensource.org/licenses/BSD-3-Clause' target='_blank'>Modified-BSD License</a> veröffentlicht. Der Code kann auf <a href='https://github.com/wmde/picsome' target='_blank'>GitHub</a> eingesehen, heruntergeladen und anschließend verändert und neu veröffentlicht werden. Wenn nicht anders angegeben, stehen alle Texte und Designs der Anwendung unter der Lizenz <a href='https://creativecommons.org/licenses/by-sa/4.0/deed.de' target='_blank'>Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International</a> und können unter den in der Lizenz genannten Bedingungen weiterverwendet, verändert und veröffentlicht werden. Die Anwendung wurde außerdem multilingual konzipiert, damit sie zukünftig auch international nutzbar ist." />
          </p>
        </Accordion>

        <Accordion theme="general" title={<T _str="Wer hostet die Bilder?" />}>
          <p>
            <UT _str="picsome selbst hostet keine Bilder, sie werden lediglich verlinkt (gebookmarkt) und als kleine Vorschaubilder eingeblendet. Die Originaldatei bleibt jedoch im ursprünglichen Repositorium - ein Download von Bilddateien ist nur über den Besuch der entsprechenden Quelle möglich. Wenn du das jeweilige Bild herunterladen möchtest, gelangst du per Link zur jeweiligen Plattform mit der Originaldatei. " />
          </p>
        </Accordion>

        {/* <!-- END --> */}

        <h2 id="topics">
          <T _str="Organisatorische Hinweise zur Nutzung" />
        </h2>

        <Accordion
          theme="topics"
          title={<T _str="Muss ich mich registrieren, um picsome zu nutzen?" />}
        >
          <p>
            <UT _str="Das Suchen und Anschauen von Bildern und Sammlungen sowie die Nutzung des Lizenzcheckers sind ohne Registrierung möglich. Nach erfolgreicher Registrierung kannst Du auf picsome ein Profil erstellen, Sammlungen anlegen und Bilder mit Tags versehen. Dafür benötigst du lediglich eine E-Mail-Adresse. Unsere vollständigen Nutzungsbedingungen findest du unter: <a href='/nutzungsbedingungen' target='_blank'>/nutzungsbedingungen</a>" />
          </p>
        </Accordion>

        <Accordion theme="topics" title={<T _str="Kann ich meinen Account wieder löschen?" />}>
          <p>
            <UT _str="Deinen Account kannst Du per E-Mail mit dem Betreff “Kontolöschung” an picsome@wikimedia.de oder direkt auf picsome (“Mein Account” → “Konto löschen”) löschen. Deine Sammlungen und Tags bleiben nach der Löschung Deines Accounts bestehen. Unsere vollständigen Nutzungsbedingungen findest du unter: <a href='/nutzungsbedingungen' target='_blank'>/nutzungsbedingungen</a>" />
          </p>
        </Accordion>

        <Accordion theme="topics" title={<T _str="Wie kann ich einen Fehler melden?" />}>
          <p>
            <UT _str="picsome ist inzwischen in der offenen Betaphase angekommen. Trotzdem kann es sein, dass es hier und dort noch etwas ruckelt. Wenn dir also auffällt, dass etwas nicht richtig funktioniert, kannst du uns dies mitteilen, indem du auf den roten Kasten “Bug melden” auf der rechten Seite deines Bildschirms klickst und den Fehler über das Formular meldest. Natürlich kannst du uns auch jederzeit über <a href='mailto:picsome@wikimedia.de'>picsome@wikimedia.de</a> erreichen." />
          </p>
        </Accordion>

        <Accordion
          theme="topics"
          title={<T _str="Wie kann ich Wünsche für weitere Features äußern?" />}
        >
          <p>
            <UT _str="Wenn dir bei der Nutzung von picsome bestimmte Features fehlen, kannst du über einen Klick auf den blauen Kasten “Funktionen vorschlagen” auf der linken Seite deines Bildschirms ein Formular öffnen. Darüber kannst du uns mitteilen, welche zusätzlichen Features du dir wünscht. Natürlich kannst du uns auch jederzeit über <a href='mailto:picsome@wikimedia.de'>picsome@wikimedia.de</a> erreichen." />
          </p>
          <p>
            <UT _str="Wir werden auch bald wieder qualitative User Interviews anbieten. Wenn du die Betaversion lieber im Rahmen eines angeleiteten Test-Szenarios ausprobieren möchtest, kannst du dich gerne für unsere <a href='https://www.wikimedia.de/projects/picsome/#werde-testerin' target='_blank'>Tester*innen-Liste</a> anmelden. In diesen ca. 30 bis 45-minütigen Online-Interviews testen wir die Anwendung gemeinsam, und es gibt reichlich Gelegenheit für Feedback. Weitere Informationen zu Ablauf und Zeitpunkt der Testings folgen!" />
          </p>
        </Accordion>

        {/* <!-- END --> */}

        <h2 id="collections">
          <T _str="Praktische Hinweise zur Nutzung" />
        </h2>

        <Accordion theme="collect" title={<T _str="Wie funktioniert die Suche nach Bildern?" />}>
          <p>
            <UT _str="picsome setzt <a href='https://www.wikidata.org/wiki/Wikidata:Introduction/de' target='_blank'>Wikidata</a> zum Suchen und Taggen der Bilder ein. Bilder, die zu picsome hinzugefügt (also gebookmarkt und damit gesammelt) werden, können durch ihre Nutzer*innen per interner Suchfunktion gefunden werden." />
          </p>
          <p>
            <UT _str="Wenn nach Bildern zu einem Suchbegriff gesucht wird, zu dem bislang noch kein Bild auf picsome gesammelt worden ist, haben wir eine externe Suche durch die Anbindung von <a href='https://wordpress.org/openverse/' target='_blank'>Openverse</a> (ehemals <a href='https://creativecommons.org/2021/12/13/dear-users-of-cc-search-welcome-to-openverse/' target='_blank'>CC-Search</a>) integriert. Auf diese Weise liefert jede Suchanfrage auch immer ein passendes Ergebnis." />
          </p>
        </Accordion>

        <Accordion theme="collect" title={<T _str="Wie kann ich Bilder auf picsome sammeln?" />}>
          <p>
            <UT _str="Du kannst auf picsome Sammlungen anlegen und/oder Bilder zu bestehenden Sammlungen hinzufügen. Alle deine Sammlungen können von anderen Nutzer*innen gefunden, angeschaut und auch mitbearbeitet werden (vorausgesetzt die Sammlung wurde von dir zum gemeinsamen Sammeln freigegeben)." />
          </p>
          <p>
            <UT _str="Registrierte Nutzer*innen können Bilder zu den eigenen Sammlungen hinzufügen, wenn diese entweder über die eingebaute Suche gefunden oder über den Lizenzchecker analysiert werden konnten." />
          </p>
        </Accordion>

        <Accordion
          theme="collect"
          title={<T _str="Warum sollten die Bilder mit Tags versehen werden?" />}
        >
          <p>
            <UT _str="Bilder, die nicht mit Tags versehen sind, können durch die Suche auf picsome nicht gefunden und beispielsweise einer Sammlung hinzugefügt werden. Um es den anderen Nutzer*innen zu erleichtern, passende Bilder zu finden, solltest du daher immer darauf achten, die von dir hinzugefügten Bilder mit entsprechenden Tags zu versehen." />
          </p>
          <p>
            <UT _str="Auf der Startseite findest du die Kategorie <a href='/resources/tagfree' target='_blank'>“Bildersuche verbessern”</a>. Hier befinden sich alle Bilder, die sich freuen, von dir mit Tags versehen zu werden. So kannst du dabei helfen, die Suche für alle zu verbessern!" />
          </p>
        </Accordion>

        <Accordion
          theme="collect"
          title={<T _str="Wie erstelle ich einen korrekten Lizenzhinweis?" />}
        >
          <p>
            <UT _str="Wenn du freigegebene Inhalte nutzen möchtest, bist du verpflichtet, die entsprechenden Lizenzbedingungen einzuhalten und einen Lizenzhinweis anzugeben. Den korrekten Lizenzhinweis für dein Bild kannst du mithilfe des <a href='/check' target='_blank'>Lizenzcheckers</a> erhalten." />
          </p>
          <p>
            <UT _str="Der Lizenzhinweis muss bei allen CC-Lizenzen (außer CC0) mindestens den Namen der Urheberin bzw. des Urhebers, den Titel des Werkes sowie den Hinweis auf die jeweilige Lizenz, unter der das Werk steht (optimalerweise mit Link zum Lizenztext) enthalten. Auch wenn rein rechtlich nicht verpflichtend, sollte immer auch die Quelle des jeweiligen Werkes angegeben werden. Ebenso müssen Änderungen, die am Werk vorgenommen wurden, im Lizenzhinweis angegeben werden. " />
          </p>
          <p>
            <UT _str="Der Lizenzhinweis sollte optimalerweise direkt im Umfeld des verwendeten Bildes platziert werden, beispielsweise als Teil der Bildunterschrift. Faustregel ist: Nachnutzende müssen die Lizenzangaben intuitiv und leicht finden können; dies ist z. B. auch über ein Abbildungsverzeichnis mit entsprechenden Lizenzhinweisen am Ende eines Skriptes oder Präsentation möglich." />
          </p>
          <p>
            <UT _str="Diese Anwendung soll die lizenzkonforme Nachnutzung von bestimmten urheberrechtlich geschützten Bildern vereinfachen. Sie kann niemals alle möglichen Anwendungsfälle und Besonderheiten abdecken und ersetzt in keinem Fall die qualifizierte juristische Beratung durch einen Anwalt." />
          </p>
        </Accordion>
      </Content>
    </Grid>
  )
}

export const getServerSideProps = async (context) => {
  return {
    props: {},
  }
}

FAQPage.suppressFirstRenderFlicker = true
// TODO: How to translate 'FAQ' here?
FAQPage.getLayout = (page) => <Layout title="FAQ">{page}</Layout>

export default FAQPage
