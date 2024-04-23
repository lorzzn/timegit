import { DayDate, daydate } from "@/utils/daydate"
import { randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { dump } from "js-yaml"
import { compact } from "lodash"
import ActivityType from "./activityType"

export type UserActivityProps = {
  date: DayDate | string | number
  activity: ActivityType | null

  start: DayDate | string | number
  end: DayDate | string | number

  description?: string
}

class UserActivity {
  static dateLabelPrefix: string = "@date:"

  date: DayDate
  activity: UserActivityProps["activity"]

  start: DayDate
  end: DayDate

  description: UserActivityProps["description"]

  constructor(props: UserActivityProps) {
    this.validateProps(props)
    const { date, activity, start, end, description } = props

    this.date = daydate(date)
    this.activity = activity
    this.start = daydate(start)
    this.end = daydate(end)
    this.description = description
  }

  private validateProps(props: UserActivityProps): void {
    const { date, start, end } = props
    if (!daydate(date).isValid()) {
      throw new Error("Invalid date")
    }

    if (!daydate(start).isValid()) {
      throw new Error("Invalid start time")
    }

    if (!daydate(end).isValid()) {
      throw new Error("Invalid end time")
    }
  }

  static dateToLabelValue(date: DayDate) {
    return `${UserActivity.dateLabelPrefix}${date.year()}-${date.month() + 1}-${date.date()}`
  }

  toIssueObject(): Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] {
    return {
      title: randomString(8, "Timegit | "),
      labels: compact(["timegit", UserActivity.dateToLabelValue(this.date), this.activity?.name]),
      body: dump({
        start: this.start.format("YYYY-MM-DD HH:mm:ss"),
        end: this.end.format("YYYY-MM-DD HH:mm:ss"),
        description: this.description,
      }),
    }
  }
}

export default UserActivity
