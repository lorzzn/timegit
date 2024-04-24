import { RecordsList } from "@/trpc/server/types/records"
import { DayDate, daydate } from "@/utils/daydate"
import { randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { dump, load } from "js-yaml"
import { compact } from "lodash"
import tinycolor from "tinycolor2"
import Activity from "./activity"

export type RecordProps = {
  id?: number
  date: DayDate
  activities: Activity[]
  start: DayDate
  end: DayDate
  description: string
}

class Record {
  static dateLabelPrefix: string = "@date:"

  id: RecordProps["id"]
  date: RecordProps["date"]
  activities: RecordProps["activities"]
  start: RecordProps["start"]
  end: RecordProps["end"]
  description: RecordProps["description"]

  constructor(props: RecordProps) {
    this.validateProps(props)
    const { date, activities, start, end, description, id } = props

    this.id = id
    this.date = daydate(date)
    this.activities = activities.map(
      (activity) =>
        new Activity({
          ...activity,
          color: tinycolor(activity.color).toPercentageRgbString(),
        }),
    )
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

  static fromIssueObject(issue: RecordsList[0]): Record {
    const { body, id } = issue
    if (!id) {
      throw new Error("Issue format error")
    }

    if (!body) {
      throw new Error("Issue format error")
    }

    const labels = issue.labels.filter((item): item is Exclude<(typeof issue.labels)[0], string> => {
      return typeof item !== "string"
    })

    const dateLabel = labels.find((label) => label.name?.startsWith(Record.dateLabelPrefix))
    if (!dateLabel) {
      throw new Error("Unsupported issue")
    }

    const date = dateLabel.name?.replace(Record.dateLabelPrefix, "")
    if (!date) {
      throw new Error("Issue format error")
    }

    const { start, end, description } = load(body) as {
      start: string
      end: string
      description: string
    }

    const activities = labels
      .filter((label) => label.name?.startsWith(Activity.labelPrefix))
      .map(
        (label) =>
          new Activity({
            ...label,
            color: tinycolor(label.color || undefined).toPercentageRgbString(),
            description: label.description || "",
          }),
      )

    return new Record({
      id,
      date: daydate(date),
      activities,
      start: daydate(start),
      end: daydate(end),
      description: description,
    })
  }

  toIssueObject(): Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] {
    return {
      title: randomString(8, "Timegit | "),
      labels: compact([
        "timegit",
        Record.dateToLabelValue(this.date),
        ...this.activities.map((activity) => activity.name),
      ]),
      body: dump({
        start: this.start.format("YYYY-MM-DD HH:mm:ss"),
        end: this.end.format("YYYY-MM-DD HH:mm:ss"),
        description: this.description,
      }),
    }
  }
}

export default Record
