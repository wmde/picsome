import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import changeEmail from "app/auth/mutations/changeEmail"
import getCurrentUser from "app/users/queries/getCurrentUser"
import styles from "./settings.module.scss"
import {
  BlitzPage,
  GetServerSideProps,
  getSession,
  invokeWithMiddleware,
  Link,
  resolver,
  Router,
  Routes,
  useMutation,
} from "blitz"
import { changeEmailInputSchema } from "app/auth/validations"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { T, useT } from "@transifex/react"
import { useCallback, useState } from "react"
import { DangerActionModal } from "app/auth/components/DangerActionModal"
import deleteAccount from "app/auth/mutations/deleteAccount"
import { AccountDataExportModal } from "app/auth/components/AccountDataExportModal"
import Button from "app/core/components/Button"
import logout from "app/auth/mutations/logout"

type SettingsUser = {
  id: number
  role: string
  name: string | null
  email: string
}

const ChangeEmailSettingsSection = (props: { user: SettingsUser }) => {
  const [changeEmailMutation, { variables: mutationVariables, isSuccess }] =
    useMutation(changeEmail)

  const emailLabel = useT("E-Mail Adresse")
  const formErrorText = useT(
    "Entschuldigung, wir hatten einen unerwarteten Fehler. Bitte versuche es erneut."
  )
  const submitText = useT("E-Mail Adresse ändern")
  const helpText = useT(
    "Wenn du das änderst, senden wir dir eine E-Mail an deine neue Adresse, um die Änderung zu bestätigen. Die neue Adresse wird erst nach Bestätigung aktiv."
  )

  return (
    <section className={styles.section}>
      <h2>
        <T _str="E-Mail Adresse ändern" />
      </h2>

      {isSuccess ? (
        <p>
          <T
            _str="Deine E-Mail-Adresse wurde noch nicht aktualisiert. Bitte prüfe deinen Posteingang für {newEmail} auf eine Bestätigungs-E-Mail."
            newEmail={<strong>{(mutationVariables as any)?.newEmail}</strong>}
          />
        </p>
      ) : (
        <Form
          submitText={submitText}
          schema={changeEmailInputSchema}
          initialValues={{ newEmail: props.user.email }}
          onSubmit={async (values) => {
            try {
              await changeEmailMutation(values)
            } catch (error: any) {
              return {
                [FORM_ERROR]: formErrorText,
              }
            }
          }}
        >
          <div className={styles.field}>
            <LabeledTextField name="newEmail" label={emailLabel} placeholder={emailLabel} />
            <p className={styles.help}>
              <T _str={helpText} />
            </p>
          </div>
        </Form>
      )}
    </section>
  )
}

const ManageAccountSettingsSection = (props: { user: SettingsUser }) => {
  const { user } = props

  const [deleteAccountMutation] = useMutation(deleteAccount)
  const [showDeletionModal, setShowDeletionModal] = useState(false)
  const [showAccountDataExportModal, setShowAccountDataExportModal] = useState(false)

  const deletionErrorText = useT(
    "Entschuldigung, wir hatten einen unerwarteten Fehler. Bitte versuche es erneut."
  )

  const onConfirmDeletion = useCallback(async () => {
    setShowDeletionModal(false)
    try {
      await deleteAccountMutation({
        userId: user.id,
      })
      Router.push(Routes.Home())
    } catch (error) {
      alert(deletionErrorText)
    }
  }, [deleteAccountMutation, deletionErrorText, user.id])

  return (
    <section className={styles.section}>
      <h2>
        <T _str="Konto verwalten" />
      </h2>
      <ul className={styles.section__buttons}>
        <li>
          <Button as="primary" onClick={() => setShowAccountDataExportModal(true)}>
            <T _str="Daten exportieren" />
          </Button>
        </li>
        <li>
          <Button as="primary" onClick={() => setShowDeletionModal(true)}>
            <T _str="Konto löschen" />
          </Button>
        </li>
      </ul>
      {showAccountDataExportModal && (
        <AccountDataExportModal onClose={() => setShowAccountDataExportModal(false)} />
      )}
      {showDeletionModal && (
        <DangerActionModal
          confirmationValue={user.email}
          onClose={() => setShowDeletionModal(false)}
          onConfirm={onConfirmDeletion}
        >
          <T _str="Dies wird dein Benutzerkonto, zusammen mit allen angelegten Sammlungen, permanent löschen." />{" "}
          <T _str="Diese Aktion kann nicht rückgängig gemacht werden." /> <br />
          <br />
          <T _str="Nach erfolgreicher Kontolöschung loggen wir dich aus und leiten dich zur Startseite weiter." />
        </DangerActionModal>
      )}
    </section>
  )
}

export type UserSettingsPageProps = {
  user: SettingsUser
}

export const getServerSideProps: GetServerSideProps<UserSettingsPageProps> = async ({
  req,
  res,
}) => {
  // TODO: Handle unauthenticated user
  const user = await invokeWithMiddleware(
    resolver.pipe(resolver.authorize(), getCurrentUser),
    {},
    { req, res }
  )

  return {
    props: {
      user: user!,
    },
  }
}

const UserSettingsPage: BlitzPage<UserSettingsPageProps> = (props) => {
  const { user } = props

  const [logoutMutation] = useMutation(logout)

  return (
    <>
      <Grid>
        <div className={styles.header}>
          <Link href={Routes.UserHome()}>
            <a className={styles.button}>
              <T _str="Mein Account" />
            </a>
          </Link>
          <button
            className={styles.button}
            onClick={async () => {
              await logoutMutation()
            }}
          >
            <T _str="Logout" />
          </button>
        </div>
      </Grid>
      <Grid>
        <div className={styles.settings}>
          <h1>
            <T _str="Kontoeinstellungen" />
          </h1>
          <ChangeEmailSettingsSection user={user} />
          <ManageAccountSettingsSection user={user} />
        </div>
      </Grid>
    </>
  )
}

UserSettingsPage.authenticate = { redirectTo: Routes.LoginPage() }
UserSettingsPage.getLayout = (page) => <Layout title={"Kontoeinstellungen"}>{page}</Layout>

export default UserSettingsPage
