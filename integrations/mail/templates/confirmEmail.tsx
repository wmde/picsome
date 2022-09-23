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

export default function ConfirmEmailMail(props: any) {
  const { newEmail, url } = props

  const description = t(
    "Du hast vor kurzem angefordert, die E-Mail-Adresse zu deinem Konto zu ändern. Wenn das stimmt, klicke bitte zur Änderung auf den Button."
  )
  const description2 = t(
    "Du kannst diese E-Mail ruhig ignorieren und löschen, wenn du das nicht tun möchtest."
  )
  const description3 = t("Diese E-Mail wurde versandt an:") + " " + newEmail

  const title = t("Bestätige deine neue E-Mail Adresse")
  const preview = t("Klicke auf den Button, um deine neue E-Mail Adresse zu bestätigen")
  const headline = t("E-Mail-Änderungsanfrage")
  const button = t("E-Mail Adresse bestätigen")

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
            <MjmlSpacer height="40px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection fullWidth backgroundColor="#ffffff">
          <MjmlColumn width="100%" vertical-align="middle">
            <MjmlImage
              width="500px"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Halifax_Public_Gardens_%2821587015098%29.jpg/800px-Halifax_Public_Gardens_%2821587015098%29.jpg"
            />
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass="title-1 bold">{headline}</MjmlText>
            <MjmlText font-size="14px" line-height="18px">
              <br />
              <br />
              {description}
              <br />
              <br />
              {description2}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlButton fontWeight={600} padding="20px" backgroundColor="#346DB7" href={url}>
              {button}
            </MjmlButton>
            <MjmlText font-size="12px" line-height="12px">
              <a href={url}>{url}</a>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height="40px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText font-size="14px" line-height="18px">
              {description3}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height="40px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <MjmlText font-size="12px" line-height="18px" color="#ccc">
              {`Tony Webster (https://www.flickr.com/people/87296837@N00), Halifax Public Gardens (21587015098) (https://commons.wikimedia.org/wiki/File:Halifax_Public_Gardens_(21587015098).jpg), CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0/)`}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}
