import { create } from "zustand"

export type ThemeType = "light" | "dark"

type LayoutStoreType = {
  theme?: ThemeType
  setTheme: (theme: ThemeType) => void
}

const useLayoutStore = create<LayoutStoreType>((set) => ({
  setTheme: (theme) => set(() => ({ theme })),
}))

export default useLayoutStore
