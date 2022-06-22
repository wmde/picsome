import db, { User } from "db"
import {
  getSession,
  BlitzApiRequest,
  BlitzApiResponse,
  NotFoundError,
  AuthorizationError,
  invokeWithMiddleware,
} from "blitz"
import getCollectionResources, {
  CollectionResource,
} from "app/resources/queries/getCollectionResources"
import getUserExportableTaggedResources from "app/resources/queries/getUserExportableTaggedResources"
import getUserJoinedCollections from "app/collections/queries/getUserJoinedCollections"
import getUserOwnedCollections from "app/collections/queries/getUserOwnedCollections"
import getUserSmartCollections from "app/collections/queries/getUserSmartCollections"
import { CollectionWithResources } from "app/collections/queries/getCollection"
import { formatDateForExport } from "lib/util"
import { stringify } from "csv-stringify/sync"

export default async function exportCollections(req: BlitzApiRequest, res: BlitzApiResponse) {
  // Make sure this is called using a GET request
  if (req.method !== "GET") {
    throw new NotFoundError()
  }

  const session = await getSession(req, res)
  if (!session.userId) {
    throw new AuthorizationError()
  }

  const user = await db.user.findFirst({ where: { id: session.userId } })
  if (!user) {
    throw new AuthorizationError()
  }

  // Gather user related collections
  const ctx = { req, res }
  const collectionResourcesInput = { take: 0 }
  const joinedCollections = await invokeWithMiddleware(
    getUserJoinedCollections,
    { collectionResourcesInput },
    ctx
  )
  const ownedCollections = await invokeWithMiddleware(
    getUserOwnedCollections,
    { collectionResourcesInput },
    ctx
  )
  const smartCollections = await invokeWithMiddleware(
    getUserSmartCollections,
    { collectionResourcesInput },
    ctx
  )
  const collections = ([] as CollectionWithResources[]).concat(
    ownedCollections.items,
    joinedCollections.items,
    smartCollections.items
  )

  // Table rows (with header)
  const rows = [composeHeaderRow()]

  // Export the resources of all related collections
  const exportedResourceIds: number[] = []
  for (const collection of collections) {
    const collectionResources = await invokeWithMiddleware(
      getCollectionResources,
      { collectionId: collection.id },
      ctx
    )
    if (collectionResources.items.length > 0) {
      for (const resource of collectionResources.items) {
        rows.push(composeEntityRow(user, resource, collection))
        exportedResourceIds.push(resource.id)
      }
    } else {
      // Export empty collection as a row (leaving resource fields empty)
      rows.push(composeEntityRow(user, undefined, collection))
    }
  }

  // Fetch remaining resources the user left tags on that are not part of any
  // user related collection
  const remainingTaggedResources = await invokeWithMiddleware(
    getUserExportableTaggedResources,
    { userId: user.id, excludeIds: exportedResourceIds },
    { req, res }
  )
  for (const resource of remainingTaggedResources) {
    rows.push(composeEntityRow(user, resource, undefined))
  }

  // Render CSV
  const csv = stringify(rows)

  // Respond
  res.statusCode = 200
  res.setHeader("Content-Type", "text/csv")
  res.setHeader("Content-Disposition", "attachment")
  res.end(csv)
}

const composeHeaderRow = () => [
  "resourceId",
  "title",
  "tagsByOthers",
  "tagsByYou",
  "license",
  "repository",
  "resourceUrl",
  "thumbUrl",
  "imgUrl",
  "authorName",
  "authorUrl",
  "resolutionX",
  "resolutionY",
  "sizeBytes",
  "createdAt",
  "updatedAt",
  "collectionId",
  "collectionTitle",
  "collectionType",
  "collectionOwnerUserId",
  "collectionCreatedAt",
  "collectionUpdatedAt",
]

const composeEntityRow = (
  user: User,
  resource?: CollectionResource,
  collection?: CollectionWithResources
): string[] => [
  resource?.id.toString() ?? "",
  resource?.title ?? "",
  resource?.tags
    .filter((tag) => tag.userId !== user.id)
    .map((tag) => tag.label)
    .join(", ") ?? "",
  resource?.tags
    .filter((tag) => tag.userId === user.id)
    .map((tag) => tag.label)
    .join(", ") ?? "",
  resource?.license.title ?? "",
  resource?.repository ?? "",
  resource?.resourceUrl ?? "",
  resource?.thumbUrl ?? "",
  resource?.imgUrl ?? "",
  resource?.authorName ?? "",
  resource?.authorUrl ?? "",
  resource?.resolutionX.toString() ?? "",
  resource?.resolutionY.toString() ?? "",
  resource?.sizeBytes.toString() ?? "",
  resource !== undefined ? formatDateForExport(resource.createdAt) : "",
  resource !== undefined ? formatDateForExport(resource.updatedAt) : "",
  collection?.id.toString() ?? "",
  collection?.title ?? "",
  collection?.type ?? "",
  collection?.userId.toString() ?? "",
  collection !== undefined ? formatDateForExport(collection.createdAt) : "",
  collection !== undefined ? formatDateForExport(collection.updatedAt) : "",
]
