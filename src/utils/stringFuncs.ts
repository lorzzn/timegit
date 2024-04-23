export function randomString(
  length: number,
  prefix?: string,
  chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
) {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix + result
}

export const buildQuery = (query: any) => {
  let queryString = ""
  for (const key in query) {
    const value = encodeURIComponent(query[key])
    if (value) {
      queryString += `${key}=${value}&`
    }
  }
  return queryString.slice(0, -1)
}

export const buildGhapiQuery = (query: any) => {
  let queryString = ""
  for (const key in query) {
    const value = encodeURIComponent(query[key])
    if (query[key]) {
      queryString += `${key}:${value}+`
    }
  }
  return queryString.slice(0, -1)
}
