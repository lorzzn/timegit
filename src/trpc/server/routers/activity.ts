import { getEnvValue } from "@/utils/env"
import { ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const getActivityName = (str: string) => /activity\[(\w+)\]/.exec(str)?.[1]
const getActivityLabelName = (str: string) => `activity[${str}]`

export const activity = router({
  list: procedure.input(z.number()).query(async ({ ctx, input }) => {
    const session = ctx.session

    const query = buildQuery({
      repository_id: input,
      q: "activity",
    })

    const response = await ghapi(`/search/labels?${query}`, session?.token)
    await validateGhapiResponse(response)
    const data = (await response.json()) as Endpoints["GET /search/labels"]["response"]["data"]

    return data
  }),
  add: procedure
    .input(z.object({ name: z.string(), color: z.string(), description: z.string().max(100) }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session

      const body: Endpoints["POST /repos/{owner}/{repo}/labels"]["request"]["data"] = {
        name: getActivityLabelName(input.name),
        color: input.color,
        description: input.description,
      }

      const response = await ghapi(
        `/repos/${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}/labels`,
        session?.token,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      )
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["POST /repos/{owner}/{repo}/labels"]["response"]["data"]

      return data
    }),
  update: procedure
    .input(z.object({ name: z.string(), color: z.string(), new_name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session

      const body: Omit<
        Endpoints["PATCH /repos/{owner}/{repo}/labels/{name}"]["parameters"],
        "name" | "repo" | "owner"
      > = {
        new_name: input.new_name,
        color: input.color,
        description: input.description,
      }

      const response = await ghapi(
        `/repos/${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}/labels/${getActivityLabelName(input.name)}`,
        session?.token,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      )
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["PATCH /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]

      return data
    }),
  delete: procedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const session = ctx.session

    const response = await ghapi(
      `/repos/${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}/labels/${getActivityLabelName(input)}`,
      session?.token,
      {
        method: "DELETE",
      },
    )
    await validateGhapiResponse(response)
    const data = (await response.json()) as Endpoints["DELETE /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]

    return data
  }),
})
