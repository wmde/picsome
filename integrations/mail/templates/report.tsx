import React from "react"

import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlFont,
  MjmlAttributes,
  MjmlAll,
  MjmlText,
  MjmlTable,
  MjmlDivider,
  MjmlStyle,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlImage,
  MjmlSpacer,
  MjmlButton,
  MjmlClass,
} from "mjml-react"
import { t } from "@transifex/native"

export default function ReportMail(props: any) {
  const title = t("🚨 picsome - REPORT")
  const preview = t("Es wurde ein Inhalt gemeldet")
  const newReport = t("Neuer Report")
  const check = t("Inhalt ansehen")

  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlPreview>{preview}</MjmlPreview>
        <MjmlFont name="Montserrat" href="https://fonts.googleapis.com/css2?family=Montserrat" />
        <MjmlAttributes>
          <MjmlAll padding="0" />
          <MjmlSection padding="0 56px 24px" />
          <MjmlText color="#324353" font-family="Montserrat" font-size="16px" line-height="24px" />
          <MjmlTable color="#324353" font-size="16px" />
          <MjmlDivider border-width="1px" border-style="solid" border-color="lightgrey" />
          <MjmlClass
            name="title-1"
            color="#252525"
            font-family="Montserrat"
            font-size="24px"
            padding="56px 0 24px"
          />
          <MjmlClass name="bold" font-weight="800" />
        </MjmlAttributes>

        <MjmlStyle inline>
          {`
      .body-section {
        -webkit-box-shadow: 0px 8px 24px rgba(163, 177, 191,0.35);
        -moz-box-shadow: 0px 8px 24px rgba(163, 177, 191, 0.35);
        box-shadow: 0px 8px 24px rgba(163, 177, 191, 0.35);
      };
      `}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody width={623}>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height="46px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection fullWidth backgroundColor="#ffffff">
          <MjmlColumn width="100%" vertical-align="middle" padding="0 0 40px">
            <MjmlImage width="100px" src="https://picsome.org/public/cc-logo.svg" />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass="title-1 bold">{newReport}</MjmlText>
            <MjmlText font-size="14px" line-height="18px">
              {props.url}
              <br />
              {props.reason}
              <br />
              {props.message}
              <br />
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlButton padding="20px" backgroundColor="#346DB7" href={props.url}>
              {check}
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}
