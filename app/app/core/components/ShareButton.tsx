import { ReactNode, MouseEvent } from "react"
import { RouteUrlObject, useRouter, Routes } from "blitz"
import styles from "./ShareButton.module.scss"
import { Share, Copy } from "./Icons"
import ReactTooltip from "react-tooltip"

export type ShareButtonProps = {
  children?: ReactNode
  url: string
}

export const ShareButton = (props: ShareButtonProps) => {
  const router = useRouter()
  const { children, url } = props

  const copyToClipboard = () => {
    navigator.clipboard && navigator.clipboard?.writeText(url)
    ReactTooltip.hide()
  }

  return (
    <>
      <button className={styles.button} data-tip data-for="shareCollection" data-event="click">
        <Share />
        <span className={styles.button__text}>{children}</span>
      </button>
      <ReactTooltip
        id="shareCollection"
        place="top"
        type="light"
        effect="solid"
        clickable={true}
        className={styles.tooltip}
      >
        {url} <Copy onClick={copyToClipboard} />
      </ReactTooltip>
    </>
  )
}
