import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import { T, UT } from "@transifex/react"
import Content from "app/core/components/Content"

const NutzungsbedingungenPage: BlitzPage = (props: any) => {
  return (
    <Grid>
      <Content>
        <h1>
          <T _str="Nutzungsbedingungen picsome" />
        </h1>
        <UT
          _str={`<h2>1. Geltungsbereich</h2>
                <p>
                  1.1 Diese Nutzungsbedingungen gelten für das gesamte unter [
                  <a href="https://picsome.org" target="_blank" rel="noreferrer">
                    https://picsome.org
                  </a>
                  ] und den dazu gehörenden Unterverzeichnissen abrufbare Angebot (im Folgenden „die
                  Plattform“). Die Plattform wird von dem Wikimedia Deutschland e. V., Tempelhofer Ufer
                  23-24, 10963 Berlin, bereitgestellt.
                </p>
                <p>
                  1.2 Das Angebot auf der Plattform soll es Dir erleichtern, Bilder unter freien Lizenzen zu
                  finden und zu nutzen. Mit einer Registrierung erhältst Du erweiterte Nutzungsmöglichkeiten
                  der Plattform.
                </p>
                <p>
                  1.3 Durch den Besuch der Plattform akzeptierst Du diese Nutzungsbedingungen. Bitte lies
                  Dir alle Bestimmungen sorgfältig durch.
                </p>

                <h2>2. Unser Angebot</h2>
                <p>
                  2.1 Auf der Plattform kannst Du Dir Fotografien und andere bildliche und grafische
                  Darstellungen (im Folgenden: “Bilder”) anzeigen lassen, die auf einer dritten Plattform
                  unter einer freien Lizenz veröffentlicht wurden. Wir selbst hosten keine Bilder, sie
                  werden lediglich verlinkt und als Frame eingeblendet. Zudem kannst Du Dir mit dem
                  Lizenzchecker unverbindlich die dem Bild zugehörige Lizenz und Attribution anzeigen
                  lassen. Weiterhin können Sammlungen erstellt und Tags vergeben werden.
                </p>
                <p>2.2 Unser Angebot ist kostenlos und verfolgt keine Gewinnerzielungsabsicht.</p>

                <h2>3. Nutzung und Registrierung</h2>
                <p>
                  3.1 Der reine Besuch der Plattform, insbesondere das Suchen und Betrachten der Sammlungen
                  und der eingebetteten Bilder, und die Nutzung des Lizenzcheckers sind ohne Registrierung
                  auf der Plattform möglich.
                </p>
                <p>
                  3.2 Das Anlegen von Sammlungen und das Tagging von Bildern setzt eine Registrierung
                  voraus. Die Registrierung ist kostenfrei und möglich, wenn Du mindestens 16 Jahre alt
                  bist. Hierfür gibst Du die abgefragten Daten in der Registrierungsmaske an und klickst
                  anschließend auf die Schaltfläche „Registrieren“. Im Anschluss daran schicken wir Dir eine
                  E-Mail zu, mit der Du Deine E-Mail-Adresse bestätigen musst. Erst mit Klick auf den
                  Bestätigungslink in der E-Mail ist der Registrierungsprozess abgeschlossen.
                </p>
                <p>
                  3.3 Du musst für die Registrierung kein Passwort erstellen. Der nächste Login erfolgt über
                  einen „Magic Link“. Das heißt, wenn Du Dich das nächste Mal einloggen möchtest, senden wir
                  Dir einen Login-Link an die von Dir bei der Registrierung angegebene E-Mail-Adresse.
                </p>
                <p>
                  3.4 Solltest Du den Verdacht haben, dass Deine Daten missbräuchlich verwendet werden,
                  melde Deinen Verdacht bitte unverzüglich an uns.
                </p>

                <h2>4. Erstellen von Inhalten, Sammlungen, Tags</h2>
                <p>
                  4.1 Nach erfolgreicher Registrierung kannst Du auf der Plattform ein Profil erstellen,
                  Sammlungen anlegen und Bilder mit Tags versehen.
                </p>
                <p>
                  4.2 Wir prüfen die von Dir veröffentlichten Inhalte nicht ohne Anlass. Du bist
                  verpflichtet, keine rechtswidrigen oder rechtswidrig erstellten Inhalte hochzuladen
                  und/oder über die Plattform zu verbreiten oder für die Verbreitung auf dieser sonst zur
                  Verfügung zu stellen. Unzulässig sind insbesondere Inhalte, für deren Verwendung Du nicht
                  die erforderlichen Nutzungsrechte hast, die das Recht anderer auf Schutz der Privatsphäre
                  oder sonstige Persönlichkeitsrechte, insbesondere das Recht am eigenen Bild, verletzen,
                  mit pornographischen, obszönen oder herabwürdigenden Motiven, die verleumderisch oder
                  ehrverletzend sind oder unwahre Tatsachenbehauptungen enthalten, die Urheber-,
                  Leistungsschutz-, Marken- oder sonstige Rechte anderer verletzen und/oder rechtlich
                  verfolgt werden können.
                </p>
                <p>
                  4.3 Du verpflichtest Dich darüber hinaus, es zu unterlassen, Inhalte einzustellen, die
                  kommerzielle Interessen verfolgen, wettbewerbswidrige Handlungen vorzunehmen oder zu
                  fördern, sonstige belästigende Handlungen gegenüber anderen Nutzenden oder Dritten über
                  die Plattform vorzunehmen, den Versuch zu unternehmen, unberechtigten Zugriff auf Daten
                  Dritter zu erlangen oder die Plattform in einer Weise zu verwenden, die zu einer
                  Überlastung oder Störungen unserer Systeme führen kann.
                </p>
                <p>
                  4.4 Die Löschung von Inhalten kann teilweise über Deinen Account erfolgen oder auch
                  jederzeit über die Meldefunktion auf der Plattform veranlasst werden.
                </p>
                <p>
                  4.5 Begehst Du Pflichtverletzungen, können und werden wir angemessene Maßnahmen treffen,
                  um diese zu unterbinden. Wir sind insbesondere berechtigt, rechtsverletzende Inhalte zu
                  bearbeiten, zu sperren oder zu löschen. Wir sind auch berechtigt sein, Dich ganz oder
                  teilweise von der Nutzung der Plattform auszuschließen.
                </p>

                <h2>5. Haftung der Nutzenden, Freistellung</h2>
                <p>
                  Im Falle Deines rechtswidrigen Verhaltens besteht die Gefahr, dass wir von Dritten wegen
                  der begangenen Rechtsverstöße in Anspruch genommen werden. Hast Du Pflichten aus diesen
                  Nutzungsbedingungen verletzt und werden wir deswegen von einem Dritten in Anspruch
                  genommen, bist Du verpflichtet, uns von allen in diesem Zusammenhang entstehenden Kosten
                  freizustellen. Die Freistellung gilt auch für alle angemessenen Kosten, die uns durch die
                  eigene Rechtsverteidigung entstehen.
                </p>

                <h2>6. Verfügbarkeit der Plattform</h2>
                <p>
                  Eine 100%ige Verfügbarkeit der Plattform kann nicht gewährleistet werden. Wir bemühen uns
                  jedoch, die Plattform so konstant wie möglich verfügbar zu halten. Insbesondere notwendige
                  Wartungsarbeiten können jedoch zu Störungen oder zur vorübergehenden Nichtverfügbarkeit
                  führen.
                </p>

                <h2>7. Datenschutz</h2>
                <p>Es gilt unsere <a href="https://picsome.org/datenschutz">Datenschutzerklärung</a>.</p>

                <h2>8. Unsere Haftung</h2>
                <p>
                  8.1 Die Lizenzhinweise erstellen wir mit angemessener Sorgfalt. Dennoch können wir Fehler
                  im Einzelfall nicht ausschließen.
                  <strong>
                    Du bist verpflichtet, Dich vor Nutzung eines Bildes und der Anbringung der
                    Lizenzhinweise zu vergewissern, dass die durch den Lizenzchecker generierten Hinweise
                    den von der jeweiligen Lizenz und dem Urheber vorgesehenen Hinweise entsprechen. Wir
                    haften nicht für Ansprüche Dritter, die durch eine nicht lizenzkonforme
                    Nutzung/Attribution durch Dich entstehen.
                  </strong>
                </p>
                <p>
                  8.2 Wir hosten keine Bilder. Wir haften nicht für Urheberrechtsverletzungen auf verlinkten
                  Internetseiten.
                </p>
                <p>
                  8.3 Schadensersatzansprüche wegen Pflichtverletzung und aus unerlaubter Handlung sind
                  sowohl gegenüber uns als auch gegenüber unseren Erfüllungs- und Verrichtungsgehilfen
                  ausgeschlossen. Diese Haftungsbeschränkung gilt nicht, wenn der Schaden vorsätzlich oder
                  grob fahrlässig verursacht wurde, sowie bei der Verletzung vertragswesentlicher Pflichten,
                  d.h. solcher Pflichten deren Erfüllung eine ordnungsgemäße Durchführung eines Vertrages
                  überhaupt erst ermöglichen, auf deren Einhaltung Du daher regelmäßig vertrauen darfst und
                  deren Verletzung auf der anderen Seite die Erreichung des Vertragszwecks gefährdet. Die
                  Haftungsbeschränkung gilt außerdem nicht für Schäden aus der Verletzung des Lebens, des
                  Körpers oder der Gesundheit, wenn wie die Pflichtverletzung zu vertreten haben. Die
                  Beschränkung gilt weiterhin nicht für Schäden, die auf dem Fehlen einer zugesicherten
                  Eigenschaft beruhen oder für die eine Haftung nach dem Produkthaftungsgesetz oder
                  sonstigen zwingenden gesetzlichen Vorschriften vorgesehen ist.
                </p>
                <p>
                  8.4 Im Übrigen ist unsere Haftung unabhängig vom Rechtsgrund ausgeschlossen. Insbesondere
                  haften wir nicht für die Inhalte von anderen Internetauftritten, die mit der Plattform
                  verlinkt sind. Verlinkungen durch Nutzende auf kostenpflichtige Internetauftritte sind
                  nicht zulässig. Wir machen uns die Inhalte von fremden verlinkten Seiten nicht zu Eigen
                  und übernehmen keine Verantwortung hierfür. Sobald wir Kenntnis von rechtswidrigen
                  Inhalten oder von einer Verlinkung auf kostenpflichtige Internetauftritte erlangen, werden
                  wir die Links entfernen oder den Zugang zu ihnen sperren.
                </p>

                <h2>9. Laufzeit und Beendigung des Vertrages</h2>
                <p>
                  9.1 Der Nutzungsvertrag wird auf unbestimmte Zeit geschlossen. Wir haben das Recht, den
                  Nutzungsvertrag mit einer Frist von 14 Tagen zu kündigen. Du kannst den Nutzungsvertrag
                  durch Löschung Deines Accounts jederzeit ohne Einhaltung einer Frist kündigen. Deinen
                  Account kannst Du per E-Mail mit dem Betreff “Kontolöschung” an
                  <a href="mailto:picsome@wikimedia.de">picsome@wikimedia.de</a>
                  oder direkt auf der Plattform löschen.
                </p>
                <p>
                  9.2 Deine Sammlungen und Tags bleiben auch nach der Löschung Deines Accounts bestehen.
                </p>
                <p>
                  9.3 Das Recht der Parteien zur außerordentlichen Kündigung aus wichtigem Grund bleibt
                  unberührt.
                </p>

                <h2>Änderung der Nutzungsbedingungen</h2>
                <p>
                  10.1 Wir haben das Recht, diese Nutzungsbedingungen um Regelungen für die Nutzung etwaig
                  neu eingeführter oder geänderter Funktionen für die Plattform, bei geänderter
                  höchstrichterlicher Rechtsprechung oder geänderter gesetzlicher Vorgaben zu ergänzen und
                  zu bearbeiten. Die geplanten Änderungen der Nutzungsbedingungen werden Dir spätestens zwei
                  Wochen vor dem geplanten Inkrafttreten per E-Mail an die von Dir bei der Registrierung
                  angegebene E-Mail-Adresse angekündigt. Deine Zustimmung zu der Änderung der
                  Nutzungsbedingungen gilt als erteilt, wenn Du der Änderung nicht innerhalb einer Frist von
                  zwei Wochen, beginnend mit dem Tag, der auf die Änderungsankündigung folgt, in Textform
                  (z. B. Brief, Fax, E-Mail) widersprichst. Wir verpflichten uns, in der
                  Änderungsankündigung auf die Möglichkeit des Widerspruchs, die Frist für den Widerspruch,
                  das Textformerfordernis sowie die Bedeutung bzw. die Folgen des Unterlassens eines
                  Widerspruchs gesondert hinzuweisen.
                </p>
                <p>
                  10.2 Widersprichst Du der Änderung der Nutzungsbedingungen form- und fristgerecht, wird
                  das Vertragsverhältnis unter den bisherigen Bedingungen fortgesetzt. Wir behalten uns für
                  diesen Fall vor, das Vertragsverhältnis zum nächstmöglichen Zeitpunkt zu kündigen.
                </p>

                <h2>11. Sonstiges, Streitbeilegung (ODR)</h2>
                <p>
                  11.1 Auf Verträge zwischen uns und Dir ist ausschließlich deutsches Recht anwendbar unter
                  Ausschluss der Bestimmungen der United Nations Convention on Contracts for the
                  International Sale of Goods (CISG, „UN-Kaufrecht“).
                </p>
                <p>
                  11.2 Sollten einzelne Bestimmungen dieser Allgemeinen Geschäftsbedingungen den
                  gesetzlichen Regelungen widersprechen und unwirksam sein, so bleiben die Regelungen im
                  Übrigen hiervon unberührt.
                </p>
                <p>
                  11.3 Die Plattform zur Online-Streitbeilegung der Europäischen Kommission erreichst Du
                  unter:
                  <a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
                    http://ec.europa.eu/consumers/odr
                  </a>
                  . Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle weder bereit noch verpflichtet.
                </p>`}
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

NutzungsbedingungenPage.suppressFirstRenderFlicker = true
NutzungsbedingungenPage.getLayout = (page) => <Layout title="Nutzungsbedingungen">{page}</Layout>

export default NutzungsbedingungenPage
