import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import { T, UT } from "@transifex/react"
import Content from "app/core/components/Content"

const AboutTheProject: BlitzPage = (props: any) => {
  return (
    <Grid>
      <Content>
        <h1>
          <T _str="Über picsome" />
        </h1>
        <UT
          _str={`<p>picsome ist ein Projekt von Wikimedia Deutschland e. V. Die Plattform soll die technische Nachfolgerin unseres <a href="https://lizenzhinweisgenerator.de/" target="_blank">Lizenzhinweisgenerators</a> werden. Die im Lizenzhinweisgenerator enthaltenen Funktionalitäten wollen wir in größerem Umfang verfügbar und beispielsweise auch für Bilder anderer Repositorien nutzbar machen. Ergänzend haben wir Bereiche zur Sammlung und Verwaltung von Bildern sowie zum Teilen von und Suchen in eigenen oder öffentlich freigegebenen Sammlungen integriert. So soll picsome zum ersten Anlaufpunkt für qualitätsvolle und lizenzkonform verwendbare Bilder werden.</p>
          <p>Wir laden alle ein, mitzumachen und in gemeinschaftlicher Arbeit die Sammlung und Kuration dieser Inhalte voranzutreiben. So können wir eine attraktive Sammlung freier und qualitativ hochwertiger Inhalte zusammentragen, die für viele Nutzer*innen eine gebrauchstaugliche Lösung bietet und das Potential hat, uns allen bei der nächsten Bildersuche viel Arbeit abzunehmen.</p>
          
          <h2>Hintergrund</h2>
          
          <h3>Freie Lizenzen ermöglichen freie Weiterverwendung</h3>

          <p>Wissen ist dann frei, wenn es für alle Menschen frei zugänglich und nutzbar ist. Das ist bislang nur in kleinen Teilbereichen unserer Gesellschaft etablierte Praxis. In den allermeisten Fällen ist die Weiterverwendung von Inhalten Dritter wie Bilder, Videos oder Texte nicht ohne Weiteres erlaubt. Teils fallen auch Gebühren für Zugang und Nutzung an oder die Nutzungsmöglichkeiten sind beschränkt.</p>
          
          <p>Hier bieten frei lizenzierte Inhalte besondere Möglichkeiten: Sie sind frei zugänglich und können von allen Menschen verwendet werden, ohne das Urheberrecht zu verletzen oder Gebühren zahlen zu müssen. Erfreulicherweise sind mittlerweile verschiedene Suchmaschinen und Mediensammlungen (Repositorien) entstanden, die sich der Suche nach und dem Angebot von freien Inhalten verschrieben haben.</p>

          <p>Wikimedia Deutschland fördert mit dem Lizenzhinweisgenerator bereits aktiv die lizenzkonforme Verwendung freier Inhalte. Der Lizenzhinweisgenerator ist ein einfacher Assistent, der bei der Erstellung von Lizenzhinweisen für alle auf Wikimedia Commons gehosteten Bildern unterstützt.</p>
          
          <h3>Der nächste Schritt für den Lizenzhinweisgenerator</h3>

          <p>Der Erfolg des Lizenzhinweisgenerators hat uns dazu bewegt, diesen konzeptionell weiterzuentwickeln. Ein erstes Ziel ist es für uns, dass die Anwendung neben Bildern von Wikimedia Commons auch für Bilder weiterer Repositorien nutzbar ist.</p>
          
          <p>Außerdem haben wir es uns zum Ziel gesetzt, unsere Nutzer*innen nicht mehr nur beim letzten Schritt der Erstellung des Lizenzhinweises zu unterstützen, sondern den gesamten Prozess der Suche, Sammlung und lizenzkonformen Nutzung frei lizenzierter Bilder zu erleichtern.<br/>
          Aus diesem Grund haben wir ein Konzept für eine Social-Bookmarking-Plattform entwickelt, die sich an Menschen richtet, die auf der Suche nach frei lizenzierten Bildern sind und diese ohne rechtliche Hürden und großen Aufwand verwenden möchten. Für diese soll unsere Anwendung die Rolle einer zentralen und neutralen Vermittlungsstelle einnehmen und den Nutzer*innen ermöglichen, für sie passende Bilder der verschiedenen Angebotsplattformen möglichst zeitsparend zu entdecken und untereinander zu vergleichen.</p>
          
          <p>Wir wollen von Beginn an offen und transparent arbeiten. Dies betrifft die Dokumentation der Entwicklungsschritte genauso wie jede Zeile geschriebenen Codes. Deshalb wurde die Anwendung Open Source entwickelt, das heißt, dass die Software und Infrastruktur offen und frei zugänglich sind. Die Anwendung wurde außerdem multilingual konzipiert, damit sie zukünftig auch international nutzbar ist.</p>
          `}
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

AboutTheProject.suppressFirstRenderFlicker = true
AboutTheProject.getLayout = (page) => <Layout title="Über das Projekt">{page}</Layout>

export default AboutTheProject
