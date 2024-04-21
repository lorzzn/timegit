import { getEnvValue } from "@/utils/env"
import Setup from "."

const SteupPage = () => {
  const repoName = getEnvValue("GITHUB_REPOSITORY_NAME")
  const repoPrivate = getEnvValue("GITHUB_REPOSITORY_PRIVATE")

  return <Setup repoName={repoName} repoPrivate={repoPrivate} />
}

export default SteupPage
