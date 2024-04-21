import { ServerSession } from "@/auth"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

export type ClientSession = {
  data: ServerSession
  status: "authenticated" | "unauthenticated" | "loading"
  update: (data?: any) => Promise<Session | null>
}

const useClientSession = (): ClientSession => {
  const session = useSession()
  return session as ClientSession
}

export default useClientSession
