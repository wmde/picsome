import Accordion from "app/core/components/Accordion"
import RadioField, { RadioFieldOptions } from "app/core/components/RadioField"
import ruleReport from "../mutations/ruleReport"
import styles from "./ReportLog.module.scss"
import { Field, Form } from "react-final-form"
import { Report } from "@prisma/client"
import { T } from "@transifex/react"
import { useId } from "react"
import { useMutation, useRouter } from "blitz"
import { hiddenItemReportStatuses } from "../shared"

const rulingOptions: RadioFieldOptions = [
  {
    value: "Pending",
    label: <T _str="Ausstehend" />,
  },
  {
    value: "Removed",
    label: <T _str="Inhalt entfernen" />,
  },
  {
    value: "Settled",
    label: <T _str="Inhalt nach Änderung wieder freischalten" />,
  },
  {
    value: "Closed",
    label: <T _str="Meldung ignorieren" />,
  },
]

const ReportLog = (props: { reports: Report[]; showRulingForm: boolean }) => {
  const router = useRouter()
  const [ruleReportMutation] = useMutation(ruleReport)

  const onRuleFormSubmit = async (formValues: any) => {
    const updatedReport = await ruleReportMutation(formValues)

    // Reload page to make changes visible
    router.reload()
  }

  return (
    <div className={styles["reports"]}>
      {props.reports.map((report) => {
        const isHidingResource = hiddenItemReportStatuses.includes(report.status)
        return (
          <Accordion
            key={report.id}
            title={
              <T
                _str="{reason} Meldung am {date}"
                date={formatDate(report.createdAt, router.locale)}
                reason={report.reason}
              />
            }
            theme={isHidingResource ? "error" : "default"}
          >
            <div className={styles["reports__report"]}>
              <p>
                <T _str="Status: {status}" status={report.status} />
                <br />
                <T _str="Grund: {reason}" reason={report.reason} />
                <br />
                <T _str="Nachricht: {message}" message={report.message} />
                <br />
                {report.ruling !== null && (
                  <>
                    <T _str="Entscheidung: {ruling}" ruling={report.ruling} />
                    <br />
                  </>
                )}
              </p>
              {props.showRulingForm && (
                <ReportRuleForm report={report} onSubmit={onRuleFormSubmit} />
              )}
            </div>
          </Accordion>
        )
      })}
    </div>
  )
}

const ReportRuleForm = (props: {
  report: Report
  onSubmit: (values: any) => Promise<void>
}): JSX.Element => {
  const rulingFieldId = useId()
  return (
    <Form
      onSubmit={props.onSubmit}
      initialValues={{
        id: props.report.id,
        nextStatus: props.report.status,
        ruling: props.report.ruling ?? "",
      }}
      render={({ handleSubmit, submitting }) => {
        return (
          <form className={styles["reports__rule-form"]} onSubmit={handleSubmit}>
            <h3 className={styles["reports__rule-form-headline"]}>
              <T _str="Entscheidung zur Meldung bearbeiten" />
            </h3>
            <label className={styles["reports__rule-form-label"]}>
              <T _str="Entscheidung" />
            </label>
            <RadioField name="nextStatus" options={rulingOptions} />

            <label className={styles["reports__rule-form-label"]} htmlFor={`${rulingFieldId}`}>
              <T _str="Erklärung (optional)" />
            </label>
            <Field
              id={`${rulingFieldId}`}
              name="ruling"
              component="textarea"
              className={styles["reports__rule-form-textarea"]}
            />

            <div className={styles["reports__rule-form-footer"]}>
              <button type="submit" disabled={submitting} className="button">
                <T _str="Entscheiden" />
              </button>
            </div>
          </form>
        )
      }}
    />
  )
}

const formatDate = (date: Date, locale?: string) => {
  return date.toLocaleDateString(locale?.replace("_", "-"), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default ReportLog
