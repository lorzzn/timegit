import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { activities } from "./activities"
import { records } from "./records"
import { repo } from "./repo"

export const appRouter = router({
  repo,
  records,
  activities,
})

export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
