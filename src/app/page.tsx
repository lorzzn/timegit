import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import { caller } from "@/trpc/server/routers/_app"
import { getEnvValue } from "@/utils/env"
import { redirect } from "next/navigation"

const fetchRepo = async () => {
  try {
    return await caller.gh.getUserRepo({ repoName: getEnvValue("GITHUB_REPOSITORY_NAME")! })
  } catch (e) {
    if (e instanceof TRPCGhapiError && e.response) {
      // repo not exist, go setup, else go home
      if (e.response.status === 404) {
        redirect("/setup")
      } else {
        redirect("/home")
      }
    } else {
      throw e
    }
  }
}

export default async function App() {
  const res = await fetchRepo()

  return (
    <div className="flex-1 w-full flex flex-col items-center ">
      <div className="">
        <div>Manage your time here</div>
      </div>
    </div>
  )
}
