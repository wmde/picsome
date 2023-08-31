import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import styles from "./index.module.scss"
import { BlitzPage, GetServerSideProps, getSession, Routes, useMutation } from "blitz"
import { T, useT } from "@transifex/react"
import blockUser from "app/auth/mutations/blockUser"
import { BlockUserInput, blockUserInputSchema } from "app/auth/validations"
import { FORM_ERROR } from "final-form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Form from "app/core/components/Form"
import deleteAccount from "app/auth/mutations/deleteAccount"
import migrateAll from "app/auth/mutations/migrateAll"

const BlockUserSection = () => {
  const [blockUserMutation, { variables: mutationVariables, isSuccess }] = useMutation(blockUser)

  const emailLabel = useT("E-Mail Adresse")
  const blockMessageLabel = useT("Grund für die Sperrung")
  const submitText = useT("Konto sperren")

  return (
    <section className={styles.section}>
      <h2>
        <T _str="Konto sperren" />
      </h2>

      {isSuccess ? (
        <p>
          <T
            _str="Das Konto {email} wurde erfolgreich gesperrt."
            email={<strong>{(mutationVariables as any)?.email}</strong>}
          />
        </p>
      ) : (
        <Form
          submitText={submitText}
          schema={blockUserInputSchema}
          initialValues={{
            email: "",
            blockMessage: "",
          }}
          onSubmit={async (values) => {
            try {
              await blockUserMutation(values as BlockUserInput)
            } catch (error: any) {
              return {
                [FORM_ERROR]: error.message,
              }
            }
          }}
        >
          <div className={styles.field}>
            <LabeledTextField name="email" label={emailLabel} required />
          </div>
          <div className={styles.field}>
            <LabeledTextField name="blockMessage" label={blockMessageLabel} required />
          </div>
        </Form>
      )}
    </section>
  )
}

const DeleteSection = () => {
  const [migrateAllMutation, { variables: isSuccess }] = useMutation(migrateAll)

  return (
    <section className={styles.section}>
      <h2>DELETE ALL</h2>

      {isSuccess ? (
        <p>Done.</p>
      ) : (
        <Form
          submitText={"Delete All"}
          onSubmit={async (values) => {
            try {
              await migrateAllMutation()
            } catch (error: any) {
              return {
                [FORM_ERROR]: error.message,
              }
            }
          }}
        ></Form>
      )}
    </section>
  )
}

export type AdminPageProps = {}

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async ({ req, res }) => {
  const session = await getSession(req, res)

  // Authorize the admin user
  await session.$authorize("ADMIN")

  return {
    props: {},
  }
}

const AdminPage: BlitzPage<AdminPageProps> = (props) => {
  return (
    <>
      <Grid>
        <div className={styles.page}>
          <h1>
            <T _str="Verwaltungskonsole" />
          </h1>
          <BlockUserSection />
          <DeleteSection />
        </div>
      </Grid>
    </>
  )
}

AdminPage.authenticate = { redirectTo: Routes.LoginPage() }
AdminPage.getLayout = (page) => <Layout title={"Verwaltungskonsole"}>{page}</Layout>

export default AdminPage
