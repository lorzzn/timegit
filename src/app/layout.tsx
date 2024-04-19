import Header from "@/components/Header"
import { NextAuthProvider } from "@/components/NextAuthProvider"
import { twclx } from "@/utils/twclx"
import { NextUIProvider } from "@nextui-org/react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Timegit",
  description: "Git your time",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <NextAuthProvider>
          <NextUIProvider>
            <div className={twclx(["flex min-h-screen flex-col w-full"])}>
              <Header />
              <div className={twclx(["flex-1 w-full flex flex-col"])}>{children}</div>
            </div>
          </NextUIProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
