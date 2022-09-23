import { z } from "zod"

const subscribeToMailingListInputSchema = z.object({
  email: z.string(),
  locale: z.string().nullable(),
})

type SubscribeToMailingListInput = z.infer<typeof subscribeToMailingListInputSchema>

const subscribeToMailingList = async (input: SubscribeToMailingListInput) => {
  const { email, locale } = input
  console.log(`Subscribing ${email} to the newsletter.`)

  const recipientListId = process.env.RAPIDMAIL_RECIPIENT_LIST_ID
  const username = process.env.RAPIDMAIL_API_USERNAME
  const password = process.env.RAPIDMAIL_API_PASSWORD

  if (!recipientListId || !username || !password) {
    console.error(
      `Error while subscribing ${email} to the newsletter. ` +
        "Please make sure all required rapidmail env variables are present."
    )
    return false
  }

  const authToken = Buffer.from(`${username}:${password}`).toString("base64")
  const response = await fetch("https://apiv3.emailsys.net/recipients?send_activationmail=yes", {
    method: "POST",
    body: JSON.stringify({
      recipientlist_id: recipientListId,
      email,
      extra1: locale ?? "unknown",
      // extra2: 'Picsome',
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + authToken,
    },
  })

  if (response.status !== 201) {
    console.error(
      `Error while subscribing ${email} to the newsletter. ` +
        `Received status code ${response.status}.`
    )
    return false
  }

  return true
}

export default subscribeToMailingList
