import { DayDate, daydate } from "@/utils/daydate"
import { randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { dump } from "js-yaml"
import { compact } from "lodash"
import Activity from "./activity"

export type RecordProps = {
  date: DayDate | string | number
  activity: Activity | null

  start: DayDate | string | number
  end: DayDate | string | number

  description?: string
}

class Record {
  static dateLabelPrefix: string = "@date:"

  date: DayDate
  activity: RecordProps["activity"]

  start: DayDate
  end: DayDate

  description: RecordProps["description"]

  constructor(props: RecordProps) {
    this.validateProps(props)
    const { date, activity, start, end, description } = props

    this.date = daydate(date)
    this.activity = activity
    this.start = daydate(start)
    this.end = daydate(end)
    this.description = description
  }

  private validateProps(props: RecordProps): void {
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
    return `${Record.dateLabelPrefix}${date.year()}-${date.month() + 1}-${date.date()}`
  }

  toIssueObject(): Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] {
    return {
      title: randomString(8, "Timegit | "),
      labels: compact(["timegit", Record.dateToLabelValue(this.date), this.activity?.name]),
      body: dump({
        start: this.start.format("YYYY-MM-DD HH:mm:ss"),
        end: this.end.format("YYYY-MM-DD HH:mm:ss"),
        description: this.description,
      }),
    }
  }
}

export default Record
