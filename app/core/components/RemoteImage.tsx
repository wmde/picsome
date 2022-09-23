import { useState } from "react"
import { Image } from "blitz"

export type RemoteImageProps = {
  src: string
  title: string
}

export const RemoteImage = (props: RemoteImageProps) => {
  const { src, title } = props

  const [loadedSrc, setLoadedSrc] = useState(src)

  return (
    <Image
      src={loadedSrc}
      alt={title}
      layout="fill"
      objectFit="cover"
      sizes="320px"
      unoptimized={true}
      onError={(e) => {
        setTimeout(() => setLoadedSrc(src), 1000)
      }}
    />
  )
}
