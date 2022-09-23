import { Modal } from "app/core/components/Modal"
import { T, useT } from "@transifex/react"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import LabeledTextField from "app/core/components/LabeledTextField"
import Form from "app/core/components/Form"

export const DangerActionModal = (props: {
  title?: string
  children?: ReactNode
  confirmationValue: string
  confirmButtonLabel?: string
  onClose: () => void
  onConfirm: () => void
}) => {
  const defaultTitle = useT("Bist du dir absolut sicher?")
  const defaultConfirmButtonLabel = useT("Ich verstehe die Konsequenzen und möchte fortfahren")

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState("")

  // Handle confirmation
  const readyToConfirm = value.toLocaleLowerCase() === props.confirmationValue.toLocaleLowerCase()
  const onConfirm = useCallback(() => {
    if (readyToConfirm) {
      props.onConfirm()
    } else {
      setValue("")
    }
  }, [readyToConfirm, props])

  // When modal opens, auto focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  })

  return (
    <Modal title={props.title || defaultTitle} onClose={props.onClose}>
      {props.children}
      <p>
        <T
          _str="Bitte gebe zur Bestätigung {confirmationValue} ein. "
          confirmationValue={<strong>{props.confirmationValue}</strong>}
        />
      </p>
      <Form initialValues={{ confirmationValue: "" }} onSubmit={onConfirm}>
        <LabeledTextField
          ref={inputRef}
          type="text"
          name="confirmationValue"
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
        />
        <button
          type="submit"
          disabled={!readyToConfirm}
          className="button"
          style={{ marginTop: "24px" }}
        >
          {props.confirmButtonLabel || defaultConfirmButtonLabel}
        </button>
      </Form>
    </Modal>
  )
}
