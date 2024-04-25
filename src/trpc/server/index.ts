import { ServerSession } from "@/auth"
import { initTRPC } from "@trpc/server"
import superjson from "superjson"

// init tRPC with context
const t = initTRPC
  .context<{
    session: ServerSession
  }>()
  .create({
    transformer: superjson,
  })

export const router = t.router
export const procedure = t.procedure
export const createCallerFactory = t.createCallerFactory
