import magicLogin from "integrations/magiclogin"
import { passportAuth } from "blitz"

export default passportAuth({
  successRedirectUrl: "/my",
  errorRedirectUrl: "/",
  strategies: [
    {
      strategy: magicLogin,
    },
  ],
})
