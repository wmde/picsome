import Button from "./Button"
import CollectionPreview from "./CollectionPreview"
import Grid from "./Grid"
import ResourcePreview from "./ResourcePreview"
import classNames from "classnames"
import styles from "./ImageText.module.scss"
import { CSSProperties } from "react"
import { License, Resource, Tag } from "db"
import { RouteUrlObject } from "blitz"
import { T, UT } from "@transifex/react"

export type ImageTextProps = {
  image?: Resource & {
    license: License
    tags: Tag[]
  }
  collection?: any
  reverse?: boolean
  background: string
  ctaurl: string | RouteUrlObject
  ctatext: string
  headline: string
  content: string
}

export interface ImageTextCSS extends CSSProperties {
  "--background"?: string
}

export const ImageText = (props: ImageTextProps) => {
  const {
    background,
    reverse = false,
    image,
    collection,
    ctaurl,
    ctatext,
    content,
    headline,
    ...rest
  } = props

  return (
    <div
      className={classNames(styles.imagetext, { [styles.reverse as string]: reverse })}
      {...rest}
    >
      <Grid>
        <div
          className={styles.container}
          style={{ "--background": background } as ImageTextCSS}
          {...rest}
        >
          <div className={styles.inner}>
            {image && (
              <div className={styles.image__container}>
                <div className={styles.image__helper}>
                  <ResourcePreview as="hero" resource={image} addable={true} />
                  {/* <ResourceImage
                    className={styles.image}
                    resource={image}
                    sizes="640px"
                    layout="intrinsic"
                  /> */}
                </div>
                {/* {imageAttribution && (
                  <div
                    className={styles.image__attribution}
                    dangerouslySetInnerHTML={{ __html: imageAttribution.html }}
                  ></div>
                )} */}
              </div>
            )}
            {collection && (
              <div className={classNames(styles.image__container, styles.white)}>
                <CollectionPreview collection={collection} hero />
              </div>
            )}
            <div className={styles.content}>
              <div className={styles.content__inner}>
                <h2 className={styles.headline}>
                  <UT _str={headline} />
                </h2>
                <div className={styles.text}>
                  <UT _str={content} />
                </div>
                <Button href={ctaurl} as="primary">
                  <T _str={ctatext} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  )
}
