import { z } from "zod"

export const magicLoginInputSchema = z.union([
  z.object({
    type: z.literal("login"),
    destination: z.string(),
    locale: z.string().nullable(),
  }),
  z.object({
    type: z.literal("signup"),
    destination: z.string(),
    acceptTerms: z.boolean(),
    subscribe: z.boolean(),
    locale: z.string().nullable(),
  }),
])

export type MagicLoginInput = z.infer<typeof magicLoginInputSchema>

export const changeEmailInputSchema = z.object({
  newEmail: z.string().email(),
})

export const confirmEmailInputSchema = z.object({
  token: z.string(),
})

export const deleteAccountInputSchema = z.object({
  userId: z.number(),
})

export const blockUserInputSchema = z.object({
  email: z.string(),
  blockMessage: z.string(),
})

export type BlockUserInput = z.infer<typeof blockUserInputSchema>
