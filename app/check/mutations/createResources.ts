import createResource, { ResourceDraft } from "./createResource"
import { LicensedAndTaggedResource } from "app/resources/queries/getResources"

/**
 * Convenience mutation to create multiple resources for the given drafts.
 * @param drafts Resource drafts
 * @returns Array of created or updated resource entities
 */
const createResources = async (drafts: ResourceDraft[]): Promise<LicensedAndTaggedResource[]> => {
  const resourceOrUndefineds = await Promise.all(drafts.map(createResource))
  // Filter out resources that could not be created
  return resourceOrUndefineds.filter((r) => r !== undefined) as LicensedAndTaggedResource[]
}

export default createResources
