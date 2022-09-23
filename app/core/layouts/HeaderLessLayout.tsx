import { ReactNode } from "react"
import { Head, Script } from "blitz"
import Footer from "../components/Footer"
import Header from "../components/Header"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const HeaderLessLayout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "picsome"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}

      <Footer />
    </>
  )
}

export default HeaderLessLayout
