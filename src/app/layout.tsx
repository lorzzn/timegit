import { NextAuthProvider } from "@/components/NextAuthProvider"
import { NextUIProvider } from "@nextui-org/react"
import type { Metadata } from "next"
import Content from "./components/Content"
import Header from "./components/Header"
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
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var t;try{var l=localStorage.getItem("theme");t=JSON.parse(l)}catch(e){t="light"}document.body.setAttribute("data-theme", t);',
          }}
        />
        <NextAuthProvider>
          <NextUIProvider>
            <div className="min-h-screen flex flex-col w-full">
              <Header />
              <Content>{children}</Content>
            </div>
          </NextUIProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
