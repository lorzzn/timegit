import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { activity } from "./activity"
import { day } from "./day"
import { gh } from "./repo"

export const appRouter = router({
  gh,
  activity,
  day,
})

// export type definition of API
export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
