import Content from "@/layout/components/Content"
import Header from "@/layout/components/Header"
import { twclx } from "@/utils/twclx"
import { PropsWithChildren } from "react"
import ClientSideProviders from "./components/ClientSideProviders"

const Layout = (props: PropsWithChildren) => {
  return (
    <ClientSideProviders>
      <div className={twclx(["min-h-screen flex flex-col w-full"])}>
        <Header />
        <Content>{props.children}</Content>
      </div>
    </ClientSideProviders>
  )
}

export default Layout
