import styles from "./PaginationNavigation.module.scss"
import { ArrowButton } from "./ArrowButton"
import { T } from "@transifex/react"
import { useNumberFormatter } from "../hooks/useNumberFormatter"

const PaginationNavigation = (props: {
  take: number
  skip: number
  count: number
  onPrevNavigation: () => void
  onNextNavigation: () => void
}) => {
  const formatNumber = useNumberFormatter()
  return (
    <div className={styles["pagination-navigation"]}>
      {props.skip > 0 && (
        <div className={styles["pagination-navigation__prev"]}>
          <ArrowButton reverse href="#" onClick={props.onPrevNavigation}>
            <T _str="Zurück" />
          </ArrowButton>
        </div>
      )}
      <div className={styles["pagination-navigation__count"]}>
        <T
          _str="{firstIndex}–{lastIndex} von {count}"
          firstIndex={formatNumber(props.skip + 1)}
          lastIndex={formatNumber(Math.min(props.skip + props.take, props.count))}
          count={formatNumber(props.count)}
        />
      </div>
      {props.skip + props.take < props.count && (
        <div className={styles["pagination-navigation__next"]}>
          <ArrowButton href="#" onClick={props.onNextNavigation}>
            <T _str="Weiter" />
          </ArrowButton>
        </div>
      )}
    </div>
  )
}

export default PaginationNavigation
