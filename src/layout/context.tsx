"use client"

import { Endpoints } from "@octokit/types"
import { createContext, useContext } from "react"

export type LayoutContextType = {
  repo?: Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]
  serverDate: number
}

export const LayoutContext = createContext<LayoutContextType>({
  serverDate: 0,
})

export const useLayoutContext = () => useContext(LayoutContext)

type LayoutContextProviderProps = {
  children: React.ReactNode
  repo?: Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]
}

export const LayoutContextProvider = ({ children, repo }: LayoutContextProviderProps) => {
  return <LayoutContext.Provider value={{ serverDate: Date.now(), repo }}>{children}</LayoutContext.Provider>
}
