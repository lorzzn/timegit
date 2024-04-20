import { auth } from "@/auth"
import { assign } from "lodash"

const ghapiBaseUrl = "https://api.github.com"

export const ghapi = async (url: string, options?: RequestInit, withAuth: boolean = true) => {
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
      const session = await auth()
      assign(options.headers, {
        Authorization: `token ${session?.token}`,
      })
    }
    return fetch(ghapiBaseUrl + url, options)
  } catch (error) {
    throw new Error("Failed to fetch data from GitHub")
  }
}
