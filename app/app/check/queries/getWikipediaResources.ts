import { resolver } from "blitz"
import { checkWikipedia } from "integrations/license-check/wikipedia"

export default resolver.pipe(async ({ url }) => {
  if (!url) {
    return undefined
  }
  return await checkWikipedia(url)
})
