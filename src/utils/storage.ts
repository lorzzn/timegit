export const setStorage = (key: string, value: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    return localStorage.setItem(key, value)
  }
}

export const getStorage = (key: string) => {
  const value = localStorage.getItem(key)
  try {
    return value && JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const removeStroage = (key: string) => {
  return localStorage.removeItem(key)
}

export const clearStorage = () => {
  return localStorage.clear()
}

export const storageKeys = {
  theme: "theme",
}
