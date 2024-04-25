import Activity from "@/models/activity"
import { getUserTimegitRepoPath, ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const activity = router({
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
        limit: z.number().min(1).max(30).default(30),
        cursor: z.number().min(1).default(1).nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const session = ctx.session

      const page = input.cursor ?? 1
      const per_page = input.limit

      const query = buildQuery({
        repository_id: input.repository_id,
        q: Activity.labelPrefix,
        sort: "created",
        order: "desc",
        page,
        per_page,
      } as Endpoints["GET /search/labels"]["parameters"])

      const response = await ghapi(`/search/labels?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["GET /search/labels"]["response"]["data"]
      const { total_count, items } = data
      const nextCursor = page * per_page < total_count ? page + 1 : null

      return {
        items,
        nextCursor,
      }
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
    if (response.status === 204) {
      return true
    } else {
      await validateGhapiResponse(response)
      const data =
        (await response.json()) as Endpoints["DELETE /repos/{owner}/{repo}/labels/{name}"]["response"]["data"]

      return data
    }
  }),
})
