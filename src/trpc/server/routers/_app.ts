import { auth } from "@/auth"
import { createCallerFactory, router } from ".."
import { activityTypes } from "./activityTypes"
import { repo } from "./repo"
import { userActivities } from "./userActivities"

export const appRouter = router({
  repo,
  userActivities,
  activityTypes,
})

export type AppRouter = typeof appRouter

const createCaller = createCallerFactory(appRouter)
export const caller = createCaller(async () => {
  return {
    session: await auth(),
  }
})
