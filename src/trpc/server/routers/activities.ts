import Activity from "@/models/activity"
import { getUserTimegitRepoPath, ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const activities = router({
  list: procedure
    .input(
      z.object({
        repository_id: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.repository_id) {
        return null
      }
      const session = ctx.session

      const query = buildQuery({
        repository_id: input.repository_id,
        q: Activity.labelMark,
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
      const activity = new Activity(input)

      const body: Endpoints["POST /repos/{owner}/{repo}/labels"]["request"]["data"] = {
        name: activity.value,
        color: activity.color,
        description: activity.description,
      }

      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/labels`, session?.token, {
        method: "POST",
        body: JSON.stringify(body),
      })
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["POST /repos/{owner}/{repo}/labels"]["response"]["data"]

      return data
    }),
  update: procedure
    .input(z.object({ name: z.string(), color: z.string(), new_name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session
      const activity = new Activity(input)

      const body: Omit<
        Endpoints["PATCH /repos/{owner}/{repo}/labels/{name}"]["parameters"],
        "name" | "repo" | "owner"
      > = {
        new_name: input.new_name,
        color: activity.color,
        description: activity.description,
      }

      const response = await ghapi(
        `/repos/${getUserTimegitRepoPath(session)}/labels/${activity.value}`,
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
  delete: procedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
    const session = ctx.session
    const activity = new Activity(input)

    const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/labels/${activity.value}`, session?.token, {
      method: "DELETE",
    })
    await validateGhapiResponse(response)
    const data = (await response.json()) as Endpoints["DELETE /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]

    return data
  }),
})
