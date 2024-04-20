import { auth } from "@/auth"
import { ghapi } from "@/utils/ghapi"
import Link from "next/link"

export default async function Index() {
  const session = await auth()

  const getRepoInfo = async () => {
    const response = await ghapi("/user", {})
    const data = await response.json()
    console.log(data)
  }

  getRepoInfo()

  return <Link href="/about">about</Link>
}
