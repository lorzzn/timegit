import { z } from "zod"

export type ActivityProps = {
  name: string
  color?: string
  description?: string
}

class Activity {
  static labelMark: string = "#activity:"

  static zodUtil = z.custom<Activity>((val) => val instanceof Activity, "Invalid activity")

  name: ActivityProps["name"]
  color?: ActivityProps["color"]
  description?: ActivityProps["description"]

  constructor(props: ActivityProps) {
    this.validateProps(props)
    const { name, color, description } = props

    this.name = name
    this.color = color
    this.description = description
  }

  private validateProps(props: ActivityProps) {
    const { description } = props
    if (description && description.length > 100) {
      throw new Error("Label description is too long")
    }
  }

  get value() {
    return `#label:${this.name}`
  }

  update(props: Partial<ActivityProps>) {
    return new Activity({ ...this, ...props })
  }
}

export default Activity
