import { getEnvValue } from "@/utils/env"
import { ghapi, validateGhapiResponse } from "@/utils/ghapi"
import { buildGhapiQuery, buildQuery, randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { z } from "zod"
import { procedure, router } from ".."

const getDateLabel = (input: { year: number; month: number; day: number }) =>
  `date[${input.year}-${input.month}-${input.day}]`

export const day = router({
  get: procedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
        day: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const session = ctx.session
      const query = buildQuery({
        q: buildGhapiQuery({
          label: getDateLabel(input),
          repo: `${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}`,
          is: "open",
        }),
      })

      const response = await ghapi(`/search/issues?${query}`, session?.token)
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["GET /search/issues"]["response"]["data"]

      if (data.total_count === 0) {
        return null
      } else {
        return {
          id: data.items[0].id,
          url: data.items[0].html_url,
        }
      }
    }),
  create: procedure
    .input(
      z.object({
        year: z.number(),
        month: z.number(),
        day: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return null
      const session = ctx.session
      const body: Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] = {
        title: randomString(8, "Created by timegit - "),
        body: "{}",
        labels: ["timegit", getDateLabel(input)],
      }

      const response = await ghapi(
        `/repos/${session?.login}/${getEnvValue("GITHUB_REPOSITORY_NAME")}/issues`,
        session?.token,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      )
      await validateGhapiResponse(response)
      const data = (await response.json()) as Endpoints["POST /repos/{owner}/{repo}/issues"]["response"]["data"]
      return {
        id: data.id,
        url: data.html_url,
      }
    }),
})
