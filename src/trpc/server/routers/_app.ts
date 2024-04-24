import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { activity } from "./activity"
import { record } from "./record"
import { repo } from "./repo"

export const appRouter = router({
  repo,
  record,
  activity,
})

export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
