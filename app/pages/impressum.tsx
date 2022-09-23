import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import { T, UT } from "@transifex/react"
import Content from "app/core/components/Content"

const ImpressumPage: BlitzPage = (props: any) => {
  return (
    <Grid>
      <Content>
        <h1>
          <T _str="Impressum" />
        </h1>
        <UT
          _str={`
          <p>Dieses Impressum gilt für die Domain https://picsome.org. </p>

          <h2>Diensteanbieter</h2>
          <p>picsome wird betrieben und entwickelt von:</p>
          <p>Wikimedia Deutschland – Gesellschaft zur Förderung Freien Wissens e. V.<br />
          Tempelhofer Ufer 23/24<br />
          10963 Berlin<br />
          E-Mail: info@wikimedia.de <br />
          Telefon: +49 (0)30-577 11 62-0<br />
          Fax: +49 (0)30-577 11 62-99</p>
          <p>Geschäftsführende Vorstände: Franziska Heine, Dr. Christian Humborg</p>
          <p>Eingetragen im Vereinsregister des Amtsgerichts Charlottenburg, VR 23855. </p>
          <p>Umsatzsteuer-ID: DE263757776</p>
          <p>Design und Entwicklung: <a href="https://konek.to">https://konek.to</a>
          <p>Der gesamte Quellcode des Dienstes wird unter der <a href="https://opensource.org/licenses/BSD-3-Clause">Modified-BSD License</a> veröffentlicht. Der Code kann auf <a href='https://github.com/wmde/picsome' target='_blank'>GitHub</a> eingesehen, heruntergeladen und anschließend verändert und neu veröffentlicht werden. Wenn nicht anders angegeben, stehen alle Texte und Designs der Anwendung unter der Lizenz <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International</a> und können unter den in der Lizenz genannten Bedingungen weiterverwendet, verändert und veröffentlicht werden. </p>
          <p>Dieses Produkt verwendet die Flickr API, ist jedoch nicht von SmugMug, Inc. bestätigt oder zertifiziert.</p>

          <h3>Büro</h3>
          <p>Wikimedia Deutschland<br />
          Gesellschaft zur Förderung Freien Wissens e. V.<br />
          Postfach 61 03 49<br />
          10925 Berlin</p>

          <p>Verantwortlicher ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.</p>
          <p>Telefon: +49 (0)30-577 11 62-0<br />
          Fax: +49 (0)30-577 11 62-99<br />
          E-Mail: info@wikimedia.de</p>
          <p>Dieses Impressum gilt auch für folgende Telemedien:</p>
          <p><a href="https://twitter.com/home">Twitter</a></p>

          <h2>Datenschutzerklärung</h2>
          <p>Auf <a href="https://picsome.org/datenschutz">https://picsome.org/datenschutz</a> finden Sie alle Hinweise darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
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

ImpressumPage.suppressFirstRenderFlicker = true
ImpressumPage.getLayout = (page) => <Layout title="Impressum">{page}</Layout>

export default ImpressumPage
