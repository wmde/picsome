import Autocomplete from "./Autocomplete"
import Grid from "./Grid"
import React, { MouseEventHandler, Suspense, useState } from "react"
import classNames from "classnames"
import styles from "./Header.module.scss"
import { Close, Menu } from "app/core/components/Icons"
import { Link as LinkIcon, Logo, WikimediaHeaderLogo } from "./Icons"
import { Routes, useRouter, Link, useSession } from "blitz"
import { WikidataItem } from "../services/wikidata"
import { searchAtom } from "app/core/state"
import { useAtom } from "jotai"
import { useT, T } from "@transifex/react"

const Header = ({ shallow = false }: { shallow?: boolean }) => {
  const router = useRouter()
  const [searchItems, setSearchItems] = useAtom(searchAtom)

  const onSearchChange = async (items: WikidataItem[]) => {
    if (items && items.length > 0) {
      setSearchItems(items)
      const query = {
        q: items.map((item) => encodeURIComponent(item.label)).join(" "),
        tags: items.map((item) => encodeURIComponent(item.id)).join(" "),
      }
      await router.push({ pathname: Routes.SearchPage().pathname, query })
    } else {
      setSearchItems([])
    }
  }

  const [openMenu, setMenuOpen] = useState(false)
  const searchPlaceholder = useT("Wonach suchst du?")
  const isServerSide = typeof window === "undefined"

  return (
    <header
      className={classNames(styles.header, {
        [styles["header--open"] as string]: openMenu,
      })}
    >
      <div className={styles["header__bar-parent"]}>
        <Grid>
          <div className={styles["header__bar-parent-inner"]}>
            <WikimediaHeaderLogo />
          </div>
        </Grid>
      </div>

      <div className={styles["header__bar-app"]}>
        <Grid>
          <div className={styles["header__bar-app-inner"]}>
            <div className={styles["header__logo"]}>
              <Link href={Routes.Home()} locale={router.locale}>
                <a>
                  <Logo />
                </a>
              </Link>
            </div>

            <div className={styles["header__search"]}>
              <Autocomplete
                value={!isServerSide ? searchItems : []}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            </div>

            <Link href={Routes.Check()}>
              <button className={styles["header__btn-check"]} onClick={() => setMenuOpen(false)}>
                <LinkIcon />
                <span className={styles["header__btn-label"]}>
                  <T _str="Lizenzchecker" />
                </span>
              </button>
            </Link>

            <button className={styles["header__btn-menu"]} onClick={() => setMenuOpen(!openMenu)}>
              <Menu />
            </button>
          </div>
        </Grid>
      </div>

      <aside className={styles["header__navigation"]}>
        <button
          className={styles["header__navigation-backdrop"]}
          onClick={() => setMenuOpen(false)}
        >
          <T _str="Schließen" />
        </button>
        <div className={styles["header__navigation-aside"]}>
          <button className={styles["header__navigation-close"]} onClick={() => setMenuOpen(false)}>
            <Close />
          </button>

          <ul className={styles["header__navigation-list"]}>
            <li>
              <Link href={Routes.Check()}>
                <button className={styles["header__btn-check"]} onClick={() => setMenuOpen(false)}>
                  <LinkIcon />
                  <span className={styles["header__btn-label"]}>
                    <T _str="Lizenzchecker" />
                  </span>
                </button>
              </Link>
            </li>

            <li>
              <Suspense
                fallback={
                  <Link href={Routes.LoginPage()} locale={router.locale}>
                    <a
                      className={styles["header__navigation-item"]}
                      onClick={() => setMenuOpen(false)}
                    >
                      <T _str="Login" />
                    </a>
                  </Link>
                }
              >
                <HeaderAccountLink onClick={() => setMenuOpen(false)} />
              </Suspense>
            </li>

            <li>
              <Link href={Routes.MultiImportPage()}>
                <a className={styles["header__navigation-item"]} onClick={() => setMenuOpen(false)}>
                  <T _str="Multi-Import" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={Routes.AboutLicenses()}>
                <a className={styles["header__navigation-item"]} onClick={() => setMenuOpen(false)}>
                  <T _str="Über Bildlizenzen" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={Routes.FAQPage()}>
                <a className={styles["header__navigation-item"]} onClick={() => setMenuOpen(false)}>
                  <T _str="Häufige Fragen" />
                </a>
              </Link>
            </li>
          </ul>

          <footer className={styles["header__navigation-footer"]}>
            <span className={styles["header__navigation-footer-text"]}>
              <T _str="Ein Projekt von" />
            </span>
            <div className={styles["header__navigation-footer-logo"]}>
              <WikimediaHeaderLogo />
            </div>
          </footer>
        </div>
      </aside>
    </header>
  )
}

const HeaderAccountLink = (props: { onClick?: MouseEventHandler }) => {
  const router = useRouter()
  const { userId } = useSession()
  return userId ? (
    <Link href={Routes.UserHome()} locale={router.locale}>
      <a className={styles["header__navigation-item"]} onClick={props.onClick}>
        <T _str="Mein Account" />
      </a>
    </Link>
  ) : (
    <Link href={Routes.LoginPage()} locale={router.locale}>
      <a className={styles["header__navigation-item"]} onClick={props.onClick}>
        <T _str="Login" />
      </a>
    </Link>
  )
}

export default Header
