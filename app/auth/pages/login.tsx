import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import styles from "./login.module.scss"
import Grid from "app/core/components/Grid"
import SignupForm from "../components/SignupForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <main className={styles.main}>
      <Grid>
        <div className={styles.container__login}>
          <LoginForm
            onSuccess={() => {
              console.log("Login successful")
              const next = "/"
              router.push(next)
            }}
          />
        </div>
        <div className={styles.divider}>
          <div className={styles.divider__horizontal}></div>
        </div>
        <div className={styles.container__register}>
          <SignupForm
            onSuccess={() => {
              console.log("success")
              const next = "/"
              router.push(next)
            }}
          />
        </div>
      </Grid>
    </main>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
