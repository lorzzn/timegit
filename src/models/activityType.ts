import tinycolor from "tinycolor2"
import { z } from "zod"

export type ActivityTypeProps = {
  id?: number
  value?: string
  name?: string // with prefix
  color?: string
  description?: string
  withoutLeadingColor?: string
}

class ActivityType {
  static labelPrefix: string = "@activity:"
  static zodUtil = z.custom<ActivityType>((val) => val instanceof ActivityType && !!val.name, "Invalid activity")

  id: ActivityTypeProps["id"]
  value: ActivityTypeProps["value"]
  color: tinycolor.Instance
  description: ActivityTypeProps["description"]

  constructor(props: ActivityTypeProps) {
    this.validateProps(props)
    const { value, color, description, id, name, withoutLeadingColor } = props

    this.id = id
    this.value = value
    this.color = tinycolor(color)
    this.description = description

    if (name) {
      this.name = name
    }

    if (withoutLeadingColor) {
      this.withoutLeadingColor = withoutLeadingColor
    }
  }

  private validateProps(props: ActivityTypeProps) {
    const { description } = props
    if (description && description.length > 100) {
      throw new Error("Label description is too long")
    }
  }

  get name() {
    return ActivityType.labelPrefix + this.value
  }

  set name(str: string) {
    if (!str.startsWith(ActivityType.labelPrefix)) {
      throw Error("Invalid label value")
    }
    this.value = str.replace(ActivityType.labelPrefix, "")
  }

  get withoutLeadingColor(): string | undefined {
    return this.color?.toHex()
  }

  set withoutLeadingColor(str: string) {
    this.color = tinycolor(str)
  }

  update(props: Partial<ActivityTypeProps>) {
    return new ActivityType({ ...this, ...props })
  }

  toObject() {
    return {
      id: this.id,
      value: this.value,
      color: this.color?.toHex(),
      description: this.description,
      name: this.name,
    }
  }
}

export default ActivityType
