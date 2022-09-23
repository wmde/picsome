import { AuthenticationError, BlitzApiRequest, BlitzApiResponse } from "blitz"

const token = process.env.API_JOBS_TOKEN ?? ""

/**
 * Authenticate a call to a /jobs/ API endpoint.
 *
 * TODO: Ideally, we would do this in a middleware but global middlewares for
 * API endpoints are not available in Blitz.js right now.
 */
const authenticateApiJobRequest = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  // Throw if no token is set in the environment (disables all job APIs)
  if (token === "") {
    throw new AuthenticationError()
  }

  // Throw if the given token does not match the expected one
  if (req.query.token !== token) {
    throw new AuthenticationError()
  }
}

export default authenticateApiJobRequest
