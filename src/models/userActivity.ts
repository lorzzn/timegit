import { randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import dayjs, { Dayjs } from "dayjs"
import { dump } from "js-yaml"
import { compact } from "lodash"
import Activity from "./activity"

export type UserActivityProps = {
  date: Dayjs | string | number
  activity: Activity | null

  start: Dayjs | string | number
  end: Dayjs | string | number

  description?: string
}

class UserActivity {
  static dateLabelMark: string = "#date:"

  date: Dayjs
  activity: UserActivityProps["activity"]

  start: Dayjs
  end: Dayjs

  description: UserActivityProps["description"]

  constructor(props: UserActivityProps) {
    this.validateProps(props)
    const { date, activity, start, end, description } = props

    this.date = dayjs(date)
    this.activity = activity
    this.start = dayjs(start)
    this.end = dayjs(end)
    this.description = description
  }

  private validateProps(props: UserActivityProps): void {
    const { date, start, end } = props
    if (!dayjs(date).isValid()) {
      throw new Error("Invalid date")
    }

    if (!dayjs(start).isValid()) {
      throw new Error("Invalid start time")
    }

    if (!dayjs(end).isValid()) {
      throw new Error("Invalid end time")
    }
  }

  static dateToLabelValue(date: Dayjs) {
    return `#date:${date.year()}-${date.month() + 1}-${date.date()}`
  }

  toIssueObject(): Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] {
    return {
      title: randomString(8, "Timegit | "),
      labels: compact(["timegit", UserActivity.dateToLabelValue(this.date), this.activity?.value]),
      body: dump({
        start: this.start.format("YYYY-MM-DD HH:mm:ss"),
        end: this.end.format("YYYY-MM-DD HH:mm:ss"),
      }),
    }
  }
}

export default UserActivity
