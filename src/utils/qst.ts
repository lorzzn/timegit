export function getQueryParams() {
  if (typeof window === "undefined") {
    throw new Error("window is not defined, please run this function in the browser")
  }
  return new URLSearchParams(window.location.search)
}

export function updateQueryString(key: string, value: string | number) {
  const searchParams = getQueryParams()

  if (searchParams.has(key)) {
    searchParams.set(key, value + "")
  } else {
    searchParams.append(key, value + "")
  }

  const newUrl = window.location.pathname + "?" + searchParams.toString()

  window.history.pushState({ path: newUrl }, "", newUrl)
}

export function getQueryStringValue(key: string) {
  const searchParams = getQueryParams()

  return searchParams.get(key)
}

export function removeQueryStringValue(key: string) {
  const searchParams = getQueryParams()

  searchParams.delete(key)

  const newUrl = window.location.pathname + "?" + searchParams.toString()

  window.history.pushState({ path: newUrl }, "", newUrl)
}
