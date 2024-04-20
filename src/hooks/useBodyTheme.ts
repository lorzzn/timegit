"use client"

import useLayoutStore from "@/stores/layout"
import { storageKeys } from "@/utils/storage"
import useLocalStorage from "beautiful-react-hooks/useLocalStorage"
import { useEffect } from "react"

const useBodyTheme = () => {
  const { setTheme: _setTheme, theme } = useLayoutStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }))

  const [storageThemeValue, setStorageThemeValue] = useLocalStorage<typeof theme>(storageKeys.theme)

  const setTheme: typeof _setTheme = (theme) => {
    if (theme) {
      // set page theme
      _setTheme(theme)
      document.body.setAttribute("data-theme", theme)
      // save theme to localstorage
      setStorageThemeValue(theme)
    }
  }

  useEffect(() => {
    // set default theme: "light"
    if (storageThemeValue) {
      setTheme(storageThemeValue)
    } else {
      setTheme("light")
    }
  }, [storageThemeValue])

  return {
    theme,
    setTheme,
  }
}

export default useBodyTheme
