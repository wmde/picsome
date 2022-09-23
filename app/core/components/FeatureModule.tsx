import { MouseEventHandler } from "react"
import Button from "./Button"
import styles from "./FeatureModule.module.scss"
import Grid from "./Grid"
import classNames from "classnames"

const FeatureModule = (props: {
  theme: "license" | "import"
  features: Array<{
    headline: string | JSX.Element
    subline: string | JSX.Element
  }>
  actionLabel?: string | JSX.Element
  onActionClick?: () => {}
}) => {
  const { onActionClick } = props

  return (
    <section
      className={classNames(styles["feature-module"], {
        [styles["feature-module--" + props.theme] as string]: true,
      })}
    >
      <Grid>
        {props.features.map((feature, index) => (
          <div key={index} className={styles["feature-module__feature"]}>
            <div className={styles["feature-module__feature-header"]}>
              <div className={styles["feature-module__feature-num"]}>{index + 1}</div>
              <h3 className={styles["feature-module__feature-headline"]}>{feature.headline}</h3>
            </div>
            <div className={styles["feature-module__feature-subline"]}>{feature.subline}</div>
          </div>
        ))}
        {props.actionLabel && onActionClick && (
          <div className={styles["feature-module__action"]}>
            <Button
              onClick={() => {
                onActionClick()
              }}
              as="large"
            >
              {props.actionLabel}
            </Button>
          </div>
        )}
      </Grid>
    </section>
  )
}

export default FeatureModule
