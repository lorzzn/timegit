import Activity from "@/models/activity"
import Record from "@/models/record"
import { dayjsZodUtil } from "@/utils/date"
import { daydate } from "@/utils/daydate"
import { getUserTimegitRepoPath, ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildGhapiQuery, buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

export const records = router({
  list: procedure
    .input(
      z.object({
        date: dayjsZodUtil,
      }),
    )
    .query(async ({ input, ctx }) => {
      const session = ctx.session
      const query = buildQuery({
        q: buildGhapiQuery({
          label: Record.dateToLabelValue(input.date),
          repo: getUserTimegitRepoPath(session),
          is: "open",
        }),
      })

      const response = await ghapi(`/search/issues?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["GET /search/issues"]["response"]["data"]

      return data
    }),
  create: procedure
    .input(
      z.object({
        date: daydate.zodUtil,
        activity: Activity.zodUtil.nullable().optional(),
        start: daydate.zodUtil,
        end: daydate.zodUtil,
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = ctx.session
      const record = new Record(input)
      const body = record.toIssueObject()
      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues`, session?.token, {
        method: "POST",
        body: JSON.stringify(body),
      })

      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["POST /repos/{owner}/{repo}/issues"]["response"]["data"]
      return data
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        date: dayjsZodUtil,
        activity: Activity.zodUtil.nullable(),
        start: dayjsZodUtil,
        end: dayjsZodUtil,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = ctx.session
      const record = new Record(input)
      const body = record.toIssueObject()
      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues/${input.id}`, session?.token, {
        method: "PATCH",
        body: JSON.stringify(body),
      })

      await validateGhapiResponse(response)
      const data =
        (await response.json()) as Endpoints["PATCH /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"]
      return {
        id: data.id,
        url: data.html_url,
      }
    }),
  delete: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = ctx.session
      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues/${input.id}`, session?.token, {
        method: "DELETE",
      })

      console.log(response.status)
      console.log(response.body)

      await validateGhapiResponse(response)
      return true
    }),
})
