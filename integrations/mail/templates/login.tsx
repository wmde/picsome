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

export default function LoginMail(props: any) {
  const description = t("Klicke einfach auf den Button um dich bei picsome einzuloggen.")
  const description2 = t("Bis gleich!")
  const description3 = t("Viel Spaß beim Erkunden von picsome 🚀")
  const description4 = t(
    "PS: Wenn du Fragen oder Anregungen für uns hast, schreib uns gern an picsome@wikimedia.de. Wir freuen uns über dein Feedback!"
  )

  const title = t("🔮 Dein Login Link für picsome")
  const preview = t("Klicke auf den Link um dich anzumelden")
  const headline = t("Hi, willkommen zurück!")
  const button = t("Login")

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
            <MjmlButton fontWeight={600} padding="20px" backgroundColor="#346DB7" href={props.url}>
              {button}
            </MjmlButton>
            <MjmlText font-size="12px" line-height="12px">
              <a href={props.url}>{props.url}</a>
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
              <br />
              <br />
              {description4}
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
