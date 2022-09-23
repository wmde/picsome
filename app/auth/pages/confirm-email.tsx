import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import styles from "./my/settings.module.scss"
import { BlitzPage, Link, useMutation, useRouterQuery, Routes } from "blitz"
import { T, useT } from "@transifex/react"
import confirmEmail from "../mutations/confirmEmail"

const ConfirmEmailPage: BlitzPage = (props) => {
  const query = useRouterQuery()
  const [confirmEmailMutation, { isSuccess, isError }] = useMutation(confirmEmail)
  const token = (query.token || "") as string

  const onConfirmClick = async () => {
    try {
      await confirmEmailMutation({ token })
    } catch (err) {}
  }

  return (
    <Grid>
      <div className={styles.settings}>
        <h1>
          <T _str="E-Mail Adresse ändern" />
        </h1>
        {isSuccess ? (
          <p>
            <T _str="Deine E-Mail-Adresse wurde erfolgreich aktualisiert. Vielen Dank." />
          </p>
        ) : isError ? (
          <T
            _str="Der E-Mail-Bestätigungslink ist ungültig oder abgelaufen. Bitte fordere in deinen {accountSettings} einen neuen Link an, um fortzufahren."
            accountSettings={
              <Link href={Routes.UserSettingsPage()}>
                <a className="link-button">
                  <T _str="Kontoeinstellungen" />
                </a>
              </Link>
            }
          />
        ) : (
          <button className="button" onClick={onConfirmClick}>
            <T _str="E-Mail Adresse bestätigen" />
          </button>
        )}
      </div>
    </Grid>
  )
}

ConfirmEmailPage.getLayout = (page) => <Layout title={"E-Mail Adresse ändern"}>{page}</Layout>

export default ConfirmEmailPage
