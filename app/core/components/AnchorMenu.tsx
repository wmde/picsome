import classNames from "classnames"
import styles from "./AnchorMenu.module.scss"

export type AnchorItem = {
  label: string
  anchor: string
}

const AnchorMenu = (props: { headline?: string; items: AnchorItem[] }) => {
  return (
    <div className={styles["anchor-menu"]}>
      {props.headline && <h1 className={styles["anchor-menu__headline"]}>{props.headline}</h1>}
      <nav className={styles["anchor-menu__scrollable"]}>
        <ul className={styles["anchor-menu__list"]}>
          {props.items.map((item, index) => (
            <li key={index} className={styles["anchor-menu__item"]}>
              <a className={classNames(styles["anchor-menu__link"])} href={`#${item.anchor}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default AnchorMenu
