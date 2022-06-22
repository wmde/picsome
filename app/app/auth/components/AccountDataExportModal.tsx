import { Modal } from "app/core/components/Modal"
import { T, useT } from "@transifex/react"

export const AccountDataExportModal = (props: { onClose: () => void }) => {
  const title = useT("Daten exportieren")
  return (
    <Modal title={title} onClose={props.onClose}>
      <p>
        <T _str="Du kannst jederzeit eine Kopie deiner Informationen herunterladen." />
      </p>
      <p>
        <T _str="Folgende Informationen liegen uns zu deinem Benutzerprofil vor:" />
      </p>
      <ul>
        <li>
          <a className="link-button" href="/api/account/export/user.csv">
            <T _str="Persönliche Informationen und Benutzerprofil (CSV)" />
          </a>
        </li>
        <li>
          <a className="link-button" href="/api/account/export/resources.csv">
            <T _str="Tabelle aller Bilder und Sammlungen (CSV)" />
          </a>
        </li>
      </ul>
      <button className="button" onClick={props.onClose}>
        <T _str="Schließen" />
      </button>
    </Modal>
  )
}
