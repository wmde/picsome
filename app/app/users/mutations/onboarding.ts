import { Ctx } from "blitz"

export default async function onboarding(input: boolean, ctx: Ctx) {
  // console.log("SESSION", ctx)
  await ctx.session.$setPublicData({ hasFinishedOnboarding: input })
}
