import Activity from "@/models/activity"
import { getUserTimegitRepoPath, ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const activities = router({
  get: procedure.input(z.object({ value: z.string() })).query(async ({ ctx, input }) => {
    const session = ctx.session
    const activity = new Activity(input)

    const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/labels/${activity.name}`, session?.token)
    await validateGhapiResponse(response)
    const data = (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]
    return data
  }),
  list: procedure
    .input(
      z.object({
        repository_id: z.number(),
        per_page: z.number().optional(),
        page: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const session = ctx.session

      const query = buildQuery({
        repository_id: input.repository_id,
        q: Activity.labelPrefix,
        sort: "created",
        order: "asc",
        page: input.page,
        per_page: input.per_page,
      })

      const response = await ghapi(`/search/labels?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["GET /search/labels"]["response"]["data"]

      return data
    }),
  create: procedure
    .input(z.object({ name: z.string(), color: z.string().optional(), description: z.string().max(100).optional() }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session
      const activity = new Activity(input)

      const body: Endpoints["POST /repos/{owner}/{repo}/labels"]["request"]["data"] = {
        name: activity.name,
        color: activity.color.toHex(),
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
    .input(
      z.object({
        name: z.string(),
        color: z.string().optional(),
        new_name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session
      const activity = new Activity(input)

      const body: Omit<
        Endpoints["PATCH /repos/{owner}/{repo}/labels/{name}"]["parameters"],
        "name" | "repo" | "owner"
      > = {
        new_name: input.new_name,
        color: activity.color.toHex(),
        description: activity.description,
      }

      const response = await ghapi(
        `/repos/${getUserTimegitRepoPath(session)}/labels/${activity.name}`,
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

    const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/labels/${activity.name}`, session?.token, {
      method: "DELETE",
    })
    await validateGhapiResponse(response)
    const data = (await response.json()) as Endpoints["DELETE /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]

    return data
  }),
})
