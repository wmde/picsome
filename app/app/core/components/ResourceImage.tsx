import { Resource } from "db"
import { Image, ImageProps } from "blitz"
import { useEffect, useState } from "react"

export declare type ResourceImageProps = Omit<
  ImageProps,
  "src" | "width" | "height" | "placeholder" | "blurDataURL" | "resource"
> & {
  resource: Pick<
    Resource,
    "id" | "thumbUrl" | "blurDataUrl" | "title" | "resolutionX" | "resolutionY"
  >
}

export type BlurData = {}

/**
 * Convenience component populating a Blitz image component from a resource
 * setting sensible defaults and configuring preloading.
 */
export const ResourceImage = (props: ResourceImageProps) => {
  const { resource, alt, layout, ...imageProps } = props

  // TODO: Is the `decodeURIComponent`-call necessary?
  // TODO: When to use another image version over `thumbUrl`?
  const src = decodeURIComponent(resource.thumbUrl)

  const [loadedSrc, setLoadedSrc] = useState(decodeURIComponent(resource.thumbUrl))
  const [blurData, setblurData] = useState("")

  useEffect(() => {
    if (loadedSrc !== src) setLoadedSrc(src)

    const blurDataUrl = resource.blurDataUrl

    if (blurDataUrl !== blurData) setblurData(blurDataUrl ? blurDataUrl : "")
  }, [resource.blurDataUrl, loadedSrc, blurData, src])

  return (
    <Image
      src={loadedSrc}
      // Use the resource title as the fallback alt text
      alt={alt || resource.title}
      // Width and height are required except for those with layout set to `fill`
      width={layout !== "fill" ? resource.resolutionX : undefined}
      height={layout !== "fill" ? resource.resolutionY : undefined}
      layout={layout}
      // Always provide the placeholder, if available
      placeholder={blurData ? "blur" : "empty"}
      blurDataURL={blurData || undefined}
      // Apply other image props
      {...imageProps}
      onError={(e) => {
        setTimeout(() => setLoadedSrc(src), 1000)
      }}
      key={resource.id}
    />
  )
}
