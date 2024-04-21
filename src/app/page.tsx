import { ServerSession, auth } from "@/auth"
import { getEnvValue } from "@/utils/env"
import { ghapi } from "@/utils/ghapi"
import { redirect } from "next/navigation"

const fetchRepo = async (session: ServerSession) => {
  const repoUrl = `/repos/${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}`
  const res = await ghapi(repoUrl, session?.token)

  if (res.status === 404) {
    redirect("/setup")
  } else {
    redirect("/home")
  }
}

export default async function App() {
  const session = await auth()

  if (session !== null) {
    await fetchRepo(session)
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center ">
      <div className="">
        <div>Manage your time here</div>
      </div>
    </div>
  )
}
