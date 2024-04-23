import { env } from "@/utils/env"
import Setup from "./client"

const SteupPage = () => {
  const repoName = env.GITHUB_REPOSITORY_NAME
  const repoPrivate = env.GITHUB_REPOSITORY_PRIVATE === "true"

  return <Setup repoName={repoName} repoPrivate={repoPrivate} />
}

export default SteupPage
