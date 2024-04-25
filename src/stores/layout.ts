import { twclx } from "@/utils/twclx"
import { create } from "zustand"

export type ThemeType = "light" | "dark"

type LayoutStoreType = {
  theme?: ThemeType
  setTheme: (theme: ThemeType) => void
  widthClass: string
}

const useLayoutStore = create<LayoutStoreType>((set) => ({
  setTheme: (theme) => set(() => ({ theme })),
  widthClass: twclx("w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 transition-[width]"),
}))

export default useLayoutStore
