import { Image } from "blitz"
import styles from "./ImagePreview.module.scss"

export type ImagePreviewProps = {
  url: string
  title: string
}

export const ImagePreview = (props: ImagePreviewProps) => {
  const { url, title, ...rest } = props

  return (
    <div className={styles.imagecontainer} {...rest}>
      <Image alt={title} src={url} layout="fill" objectFit="contain" />
    </div>
  )
}
