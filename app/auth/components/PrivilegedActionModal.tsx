import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import { Modal } from "app/core/components/Modal"
import { T, useT } from "@transifex/react"
import { SyntheticEvent, useState } from "react"

export const PrivilegedActionModal = (props: {
  title?: string
  onClose: (event?: SyntheticEvent) => void
}) => {
  const [showSignupForm, setShowSignupForm] = useState(true)
  const defaultTitle = useT("Bitte logge dich ein, um fortzufahren")
  return (
    <Modal title={props.title || defaultTitle} onClose={props.onClose}>
      <p>
        {showSignupForm ? (
          <T _str="Du hast schon ein Konto?" />
        ) : (
          <T _str="Du hast noch kein Konto?" />
        )}
        <button className="link-button" onClick={() => setShowSignupForm(!showSignupForm)}>
          {showSignupForm ? (
            <T _str="Dann logge dich hier ein!" />
          ) : (
            <T _str="Dann erstelle jetzt eins!" />
          )}
        </button>
      </p>
      {showSignupForm ? <SignupForm /> : <LoginForm />}
    </Modal>
  )
}
