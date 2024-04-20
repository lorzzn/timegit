import { auth } from "@/auth"
import Link from "next/link"

export default function Index() {
  const getUserData = async () => {
    const session = await auth()
    console.log("jwt: ", session)
  }
  getUserData()
  return <Link href="/about">about</Link>
}
