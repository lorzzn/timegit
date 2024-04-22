import Layout from "@/layout"
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
    <html suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var t;try{var l=localStorage.getItem("theme");t=JSON.parse(l)}catch(e){t="light"}document.documentElement.setAttribute("data-theme", t);',
          }}
        />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
