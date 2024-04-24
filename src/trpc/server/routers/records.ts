import Activity from "@/models/activity"
import Record from "@/models/record"
import { dayjsZodUtil } from "@/utils/date"
import { daydate } from "@/utils/daydate"
import { getUserTimegitRepoPath, ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildQuery } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { pick } from "lodash"
import { z } from "zod"
import { procedure, router } from ".."
import { RecordsList } from "../types/records"

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
        state: "open",
        labels: [Record.dateToLabelValue(input.date), "timegit"].join(","),
      } as Endpoints["GET /repos/{owner}/{repo}/issues"]["parameters"])

      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = ((await response.json()) as Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"]).map(
        (item) => {
          const picked = pick(item, ["id", "url", "title", "body", "labels", "created_at", "updated_at", "html_url"])
          return {
            ...picked,
          }
        },
      )

      return data as RecordsList
    }),
  create: procedure
    .input(
      z.object({
        date: daydate.zodUtil,
        activities: z.array(Activity.zodUtil),
        start: daydate.zodUtil,
        end: daydate.zodUtil,
        description: z.string(),
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
        activities: z.array(Activity.zodUtil),
        start: dayjsZodUtil,
        end: dayjsZodUtil,
        description: z.string(),
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
