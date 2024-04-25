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

export const record = router({
  get: procedure.input(z.object({ number: z.number() })).query(async ({ input, ctx }) => {
    const session = ctx.session
    const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues/${input.number}`, session?.token)
    await validateGhapiResponse(response)

    const _data =
      (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"]
    const data = pick(_data, ["id", "url", "title", "body", "labels", "created_at", "updated_at", "html_url", "number"])
    return data as RecordsList[0]
  }),
  list: procedure
    .input(
      z.object({
        date: dayjsZodUtil,
        page: z.number().default(1),
        per_page: z.number().default(30),
      }),
    )
    .query(async ({ input, ctx }) => {
      const session = ctx.session
      const query = buildQuery({
        state: "open",
        labels: [Record.dateToLabelValue(input.date), "timegit"].join(","),
        sort: "created",
        direction: "asc",
        page: input.page,
        per_page: input.per_page,
      } as Endpoints["GET /repos/{owner}/{repo}/issues"]["parameters"])

      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = ((await response.json()) as Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"]).map(
        (item) => {
          const picked = pick(item, [
            "id",
            "url",
            "title",
            "body",
            "labels",
            "created_at",
            "updated_at",
            "html_url",
            "number",
            "node_id",
          ])
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
        activity: Activity.zodUtil,
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
        number: z.number(),
        date: dayjsZodUtil,
        activity: Activity.zodUtil,
        start: dayjsZodUtil,
        end: dayjsZodUtil,
        description: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = ctx.session
      const record = new Record(input)
      const body = record.toIssueObject()
      const response = await ghapi(`/repos/${getUserTimegitRepoPath(session)}/issues/${input.number}`, session?.token, {
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
        issueNodeId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = ctx.session
      const query = `
mutation {
  deleteIssue(input: {issueId: "${input.issueNodeId}"}) {
    clientMutationId
  }
}
`
      const response = await ghapi("/graphql", session?.token, {
        method: "POST",
        body: JSON.stringify({
          query,
        }),
      })

      if (response.ok) {
        return true
      } else {
        await validateGhapiResponse(response)
        const data = await response.json()

        return data
      }
    }),
})
