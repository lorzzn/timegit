import { NextAuthProvider } from "@/components/NextAuthProvider"
import Content from "@/layout/components/Content"
import Header from "@/layout/components/Header"
import Provider from "@/trpc/client/provider"
import { twclx } from "@/utils/twclx"
import { NextUIProvider } from "@nextui-org/react"
import { PropsWithChildren } from "react"

const Layout = (props: PropsWithChildren) => {
  return (
    <Provider>
      <NextAuthProvider>
        <NextUIProvider>
          <div className={twclx(["min-h-screen flex flex-col w-full"])}>
            <Header />
            <Content>{props.children}</Content>
          </div>
        </NextUIProvider>
      </NextAuthProvider>
    </Provider>
  )
}

export default Layout
