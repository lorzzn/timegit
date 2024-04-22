import { ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const gh = router({
  get: procedure
    .input(
      z.object({
        repoName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { session } = ctx
      const response = await ghapi(`/repos/${session?.login}/${input.repoName}`, session?.token)

      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]
      return data
    }),
  create: procedure
    .input(
      z.object({
        repoName: z.string(),
        private: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx
      const body: Endpoints["POST /user/repos"]["request"]["data"] = {
        name: input.repoName,
        description: "A repository created by the timegit",
        private: input.private,
      }
      const response = await ghapi(`/user/repos`, session?.token, {
        method: "POST",
        body: JSON.stringify(body),
      })

      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["POST /user/repos"]["response"]["data"]
      return data
    }),
})
