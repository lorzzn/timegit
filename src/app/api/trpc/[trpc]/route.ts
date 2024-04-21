import { appRouter } from "@/trpc/server/routers/_app"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// trpc handler
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
