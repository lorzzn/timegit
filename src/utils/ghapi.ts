import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import { assign, get } from "lodash"

const ghapiBaseUrl = "https://api.github.com"

export const ghapi = async (url: string, token?: string, options?: RequestInit, withAuth: boolean = true) => {
  try {
    if (!options) {
      options = {}
    }
    if (!options.headers) {
      options.headers = {}
    }
    assign(options.headers, {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    })
    if (withAuth) {
      assign(options.headers, {
        Authorization: `token ${token}`,
      })
    }
    return fetch(ghapiBaseUrl + url, options)
  } catch (error) {
    throw new Error("Failed to fetch data from GitHub")
  }
}

export const validateGhapiResponse = async (_response: Response) => {
  const response = _response.clone()
  const data = await response.json()
  let message = get(data, "message", "")
  const documentationUrl = get(data, "documentation_url", "")

  if (message) {
    if (documentationUrl) {
      message += ` (See: ${documentationUrl})`
    }
    throw new TRPCGhapiError({
      code: "BAD_REQUEST",
      message,
      response,
    })
  }
}
