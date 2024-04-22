import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import { caller } from "@/trpc/server/routers/_app"
import { getEnvValue } from "@/utils/env"
import { redirect } from "next/navigation"
import App from "."

const fetchRepo = async () => {
  try {
    return await caller.gh.get({ repoName: getEnvValue("GITHUB_REPOSITORY_NAME")! })
  } catch (e) {
    if (e instanceof TRPCGhapiError && e.response) {
      // repo not exist, go setup, else go home
      if (e.response.status === 404) {
        redirect("/setup")
      }
    } else {
      throw e
    }
  }
}

export default async function AppPage() {
  const res = await fetchRepo()

  return <App serverDate={Date.now()} />
}
