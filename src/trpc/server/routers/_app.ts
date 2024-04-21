import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { gh } from "./gh"

export const appRouter = router({
  gh,
})

// export type definition of API
export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
