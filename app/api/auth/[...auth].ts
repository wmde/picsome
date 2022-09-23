import magicLoginStrategy from "app/auth/strategies/magic-login"
import { passportAuth, Routes } from "blitz"

export default passportAuth({
  successRedirectUrl: Routes.UserHome().pathname,
  errorRedirectUrl: Routes.Home().pathname,
  strategies: [{ strategy: magicLoginStrategy }],
})
