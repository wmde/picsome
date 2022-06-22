import { ReactNode } from "react"
import { Head } from "blitz"
import Footer from "../components/Footer"
import Header from "../components/Header"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "picsome"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {children}

      <Footer />
    </>
  )
}

export default Layout
