import Layout from "@/layout"
import { LayoutContextProvider } from "@/layout/context"
import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import { caller } from "@/trpc/server/routers/_app"
import { env } from "@/utils/env"
import "@rc-component/color-picker/assets/index.css"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "Timegit",
  description: "Git your time",
}

const fetchRepo = async () => {
  try {
    return await caller.repo.get({ repoName: env.GITHUB_REPOSITORY_NAME! })
  } catch (e) {
    if (e instanceof TRPCGhapiError && e.response) {
      // repo not exist, go setup
      if (e.response.status === 404) {
        redirect("/setup")
      }
    } else {
      throw e
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const repo = await fetchRepo()

  return (
    <html suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var t;try{var l=localStorage.getItem("theme");t=JSON.parse(l)}catch(e){t="light"}document.documentElement.setAttribute("data-theme", t);',
          }}
        />
        <LayoutContextProvider repo={repo}>
          <Layout>{children}</Layout>
        </LayoutContextProvider>
      </body>
    </html>
  )
}
