import { assign } from "lodash"

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
