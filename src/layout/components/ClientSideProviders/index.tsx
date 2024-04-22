"use client"

import Provider from "@/trpc/client/provider"
import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from "next-auth/react"

type ClientSideProvidersProps = {
  children: React.ReactNode
}

const ClientSideProviders = ({ children }: ClientSideProvidersProps) => {
  return (
    <Provider>
      <SessionProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </SessionProvider>
    </Provider>
  )
}

export default ClientSideProviders
