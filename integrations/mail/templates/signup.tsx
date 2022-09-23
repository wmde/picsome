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

export default function SignupMail(props: any) {
  const title = t("👋 Willkommen bei picsome!")
  const preview = t("Deine Registrierung bei picsome")
  const headline = t("Wir freuen uns, dass du dabei bist!")
  const descriptionOne = t("Nutze bitte den Link, um deine Registrierung abzuschließen.")
  const descriptionTwo = t(
    "Nach Bestätigung deiner Registrierung kannst du auf picsome ein Profil erstellen, Sammlungen anlegen und Bilder mit Tags versehen."
  )
  const descriptionTwo2 = t(
    " Wenn du Fragen oder Anregungen für uns hast, schreib uns gern an picsome@wikimedia.de. Wir freuen uns über dein Feedback!"
  )
  const descriptionTwo3 = t("Viel Spaß beim Erkunden von picsome 🚀")
  const button = t("Registrierung abschließen")

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
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/White_bright_fireworks.jpg/640px-White_bright_fireworks.jpg"
            />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass="title-1 bold">{headline}</MjmlText>
            <MjmlText font-size="14px" line-height="18px">
              {descriptionOne}
              <br />
              <br />
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlButton fontWeight={600} padding="20px" backgroundColor="#346DB7" href={props.url}>
              {button}
            </MjmlButton>
            <MjmlText font-size="10px" line-height="10px">
              <a href="{props.url}">{props.url}</a>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height="20px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText font-size="14px" line-height="18px">
              {descriptionTwo}
              <br />
              <br />
              {descriptionTwo2}
              <br />
              <br />
              {descriptionTwo3}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height="20px"></MjmlSpacer>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText font-size="12px" line-height="18px" color="#ccc">
              {`Ranveig (https://commons.wikimedia.org/wiki/User:Ranveig), White bright fireworks (https://commons.wikimedia.org/wiki/File:White_bright_fireworks.jpg), Public Domain (https://commons.wikimedia.org/wiki/Template:PD-author)`}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}
