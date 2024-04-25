import { auth } from "@/auth"
import { appRouter } from "@/trpc/server/routers/_app"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth()
      return {
        session,
      }
    },
  })

export { handler as GET, handler as POST }
