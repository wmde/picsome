/* eslint-disable @next/next/no-page-custom-font */
import { Document, Html, DocumentHead, DocumentContext, Main, BlitzScript } from "blitz"
import { NextRouter } from "next/dist/client/router"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps, locale: ctx.locale }
  }

  render() {
    const { locale } = this.props as any

    return (
      <Html>
        <DocumentHead>
          <script
            async
            src={`https://widget.usersnap.com/global/load/a4f70a28-ba40-45c2-b991-17e641ae341b?onload=onUsersnapCXLoad`}
          />{" "}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.onUsersnapCXLoad = function(api) {
                window.Usersnap = api;
                api.init({useLocalStorage: "false"});
                api.init({collectGeoLocation: 'none'});
                api.init({locale: "${locale === "de_DE" ? "de" : "en"}"});
            }
            `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                process.env.NODE_ENV !== "production"
                  ? `
            <!-- Matomo -->
            var _mtm = window._mtm = window._mtm || [];
            _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='https://stats.wikimedia.de/js/container_DsK38OUm_staging_9d47f63c18a0877dbfd52e24.js'; s.parentNode.insertBefore(g,s);
            <!-- End Matomo Code -->
            `
                  : `
            <!-- Matomo -->
            var _mtm = window._mtm = window._mtm || [];
            _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='https://stats.wikimedia.de/js/container_DsK38OUm.js'; s.parentNode.insertBefore(g,s);
            <!-- End Matomo Code -->
            `,
            }}
          />
          <script
            async
            src={`https://cloud.ccm19.de/app.js?apiKey=2282a0dfa3b10ba5cdce58469426718180d7cd8c6bb07e36&amp;domain=62333fe8f6fbdb4fc21b220f`}
            referrerPolicy={"origin"}
          />
        </DocumentHead>
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
