import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { activities } from "./activities"
import { activity } from "./activity"
import { repo } from "./repo"
import { userActivities } from "./userActivities"

export const appRouter = router({
  repo,
  activity,
  userActivities,
  activities,
})

export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
