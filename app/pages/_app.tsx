import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import "../../styles/index.scss"
import { SourceErrorPolicy, tx } from "@transifex/native"
import { useT } from "@transifex/react"

tx.init({
  token: process.env.NEXT_PUBLIC_TRANSIFEX_TOKEN,
  errorPolicy: new SourceErrorPolicy(),
})

export default function App({ Component, pageProps, router }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  tx.setCurrentLocale(router.locale)

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  // if (error.name === 'AuthenticationError') {
  //   return <LoginForm onSuccess={resetErrorBoundary} />
  // }

  const authorizationErrorTitle = useT("Dieser Inhalt kann derzeit nicht angezeigt werden")

  if (error.name === "AuthorizationError") {
    return <ErrorComponent statusCode={error.statusCode} title={authorizationErrorTitle} />
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
