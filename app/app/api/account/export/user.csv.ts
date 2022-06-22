import db from "db"
import {
  getSession,
  BlitzApiRequest,
  BlitzApiResponse,
  NotFoundError,
  AuthorizationError,
} from "blitz"
import { stringify } from "csv-stringify/sync"
import { formatDateForExport } from "lib/util"

export default async function exportUser(req: BlitzApiRequest, res: BlitzApiResponse) {
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

  // Header row
  const headerRow = [
    "id",
    "name",
    "email",
    "newUnconfirmedEmail",
    "role",
    "createdAt",
    "termsSignedAt",
    "updatedAt",
  ]

  // User rows
  const rows = [
    [
      user.id,
      user.name,
      user.email,
      user.newUnconfirmedEmail,
      user.role,
      formatDateForExport(user.createdAt),
      formatDateForExport(user.termsSignedAt),
      formatDateForExport(user.updatedAt),
    ],
  ]

  // Add header row
  rows.unshift(headerRow)

  // Render CSV
  const csv = stringify(rows)

  // Respond
  res.statusCode = 200
  res.setHeader("Content-Type", "text/csv")
  res.setHeader("Content-Disposition", "attachment")
  res.end(csv)
}
