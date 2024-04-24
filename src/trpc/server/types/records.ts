import { Endpoints } from "@octokit/types"

export type RecordsList = Pick<
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][0],
  "id" | "url" | "title" | "body" | "labels" | "created_at" | "updated_at" | "html_url" | "number"
>[]
