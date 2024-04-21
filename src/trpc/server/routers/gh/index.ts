import { TRPCGhapiError } from "@/trpc/errors/ghapi"
import { ghapi } from "@/utils/ghapi"
import { Endpoints } from "@octokit/types"
import { get } from "lodash"
import { z } from "zod"
import { procedure, router } from "../.."

const validateGhapiResponse = async (_response: Response) => {
  const response = _response.clone()
  const data = await response.json()
  let message = get(data, "message", "")
  const documentationUrl = get(data, "documentation_url", "")

  if (message) {
    if (documentationUrl) {
      message += ` (See: ${documentationUrl})`
    }
    throw new TRPCGhapiError({
      code: "BAD_REQUEST",
      message,
      response,
    })
  }
}

export const gh = router({
  getUserRepo: procedure
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
  createUserRepo: procedure
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
