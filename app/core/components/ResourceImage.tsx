import { Resource } from "db"
import { Image, ImageProps } from "blitz"
import { useEffect, useState } from "react"

export declare type ResourceImageProps = Omit<
  ImageProps,
  "src" | "placeholder" | "blurDataURL" | "resource"
> & {
  thumbnail?: boolean
  blurPreview?: boolean
  resource: Pick<
    Resource,
    "id" | "thumbUrl" | "imgUrl" | "blurDataUrl" | "title" | "resolutionX" | "resolutionY"
  >
}

/**
 * Convenience component populating a Blitz image component from a resource
 * setting sensible defaults and configuring preloading.
 */
export const ResourceImage = (props: ResourceImageProps) => {
  const { resource, alt, layout, thumbnail = true, blurPreview = true, ...imageProps } = props

  // TODO: Is the `decodeURIComponent`-call necessary?
  const src = thumbnail ? decodeURIComponent(resource.thumbUrl) : resource.imgUrl

  return (
    <Image
      src={src}
      // Use the resource title as the fallback alt text
      alt={alt ?? resource.title}
      // Width and height are required except for those with layout set to `fill`
      width={props.width ?? (layout !== "fill" ? resource.resolutionX : undefined)}
      height={props.height ?? (layout !== "fill" ? resource.resolutionY : undefined)}
      layout={layout}
      // Always provide the placeholder, if available
      placeholder={blurPreview && resource.blurDataUrl !== null ? "blur" : "empty"}
      blurDataURL={blurPreview && resource.blurDataUrl !== null ? resource.blurDataUrl : undefined}
      // Apply other image props
      {...imageProps}
      onError={(e) => {
        // TODO: Retry after timeout
      }}
      key={resource.id}
    />
  )
}
