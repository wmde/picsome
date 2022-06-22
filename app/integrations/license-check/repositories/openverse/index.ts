import { Repository, ResourcePreview } from "../../types"
import { ResourceDraft } from "app/check/mutations/createResource"

const getResourceDraft = async (resourceUrl: string): Promise<ResourceDraft | undefined> => {
  // TODO: Needs implementation
  return undefined
}

const getResourceDraftsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourceDraft[]> => {
  // TODO: Needs implementation
  return []
}

const getResourcePreviewsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourcePreview[]> => {
  // TODO: Needs implementation
  return []
}

const openverseRepository: Repository = {
  name: "openverse",
  getResourceDraft,
  getResourceDraftsForUrl,
  getResourcePreviewsForUrl,
}

export default openverseRepository
