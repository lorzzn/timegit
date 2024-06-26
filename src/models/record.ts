import { RecordsList } from "@/trpc/server/types/records"
import { DayDate, daydate } from "@/utils/daydate"
import { randomString } from "@/utils/stringFuncs"
import { Endpoints } from "@octokit/types"
import { dump, load } from "js-yaml"
import { compact, toString } from "lodash"
import tinycolor from "tinycolor2"
import Activity from "./activity"

export type RecordProps = {
  id?: number
  number?: number
  nodeId?: string
  date: DayDate
  activity?: Activity
  start: DayDate
  end: DayDate
  description: string
}

class Record {
  static dateLabelPrefix: string = "@date:"

  id: RecordProps["id"]
  number: RecordProps["number"]
  nodeId: RecordProps["nodeId"]
  date: RecordProps["date"]
  activity: RecordProps["activity"]
  start: RecordProps["start"]
  end: RecordProps["end"]
  description: RecordProps["description"]

  constructor(props: RecordProps) {
    this.validateProps(props)
    const { date, activity, start, end, description, id, number, nodeId } = props

    this.id = id
    this.number = number
    this.nodeId = nodeId
    this.date = daydate(date)
    ;(this.activity =
      activity &&
      new Activity({
        ...activity,
        color: tinycolor(activity.color).toPercentageRgbString(),
      })),
      (this.start = daydate(start))
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
    return `${Record.dateLabelPrefix}${date.tz("utc").startOf("date").valueOf()}`
  }

  static fromIssueObject(issue: RecordsList[0]): Record {
    const { body, id, number, node_id } = issue
    if (!id || !body || !number || !node_id) {
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

    const activity = labels.find((label) => label.name?.startsWith(Activity.labelPrefix))

    return new Record({
      id,
      number,
      nodeId: node_id,
      date: daydate(date),
      activity:
        activity &&
        new Activity({
          ...activity,
          color: tinycolor(toString(activity.color)).toHexString(),
          description: toString(activity.description),
        }),
      start: daydate(start),
      end: daydate(end),
      description: description,
    })
  }

  toIssueObject(): Endpoints["POST /repos/{owner}/{repo}/issues"]["request"]["data"] {
    return {
      title: randomString(8, "Timegit | "),
      labels: compact(["timegit", Record.dateToLabelValue(this.date), this.activity?.name]),
      body: dump({
        start: this.start.format("YYYY-MM-DD HH:mm:ssZ"),
        end: this.end.format("YYYY-MM-DD HH:mm:ssZ"),
        description: this.description,
      }),
    }
  }
}

export default Record
