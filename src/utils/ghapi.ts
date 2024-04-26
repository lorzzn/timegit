import { ServerSession } from "@/auth"
import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import chalk from "chalk"
import { assign, get } from "lodash"
import { env } from "./env"

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
    url = ghapiBaseUrl + url
    const request = new Request(url, options)
    const fetchStartTime = performance.now()
    const response = await fetch(request)

    console.log(
      "",
      request.method,
      chalk.bgGreen.white("ghapi"),
      response.url,
      (response.ok ? chalk.green : chalk.red)(response.status),
      "in",
      chalk.white((performance.now() - fetchStartTime) | 0) + "ms",
    )

    return response
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

export const getUserTimegitRepoPath = (session: ServerSession) => {
  if (!session) {
    throw new TRPCGhapiError({
      code: "UNAUTHORIZED",
      message: "You are not logged in",
    })
  }

  return `${session?.login}/${env.GITHUB_REPOSITORY_NAME}`
}
