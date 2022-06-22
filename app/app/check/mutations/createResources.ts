import createResource, { ResourceDraft } from "./createResource"

/**
 * Convenience mutation to create multiple resources for the given drafts.
 * @param drafts Resource drafts
 * @param wdIds WikidataItem ids resources are created from (unused right now)
 * @returns Array of created or updated resource entities mapped from the drafts
 */
const createResources = (drafts: ResourceDraft[], wdIds: string[] = []) => {
  return Promise.all(drafts.map(createResource))
}
export default createResources
