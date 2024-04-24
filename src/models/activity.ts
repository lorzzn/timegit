import tinycolor from "tinycolor2"
import { z } from "zod"

export type ActivityProps = {
  id?: number
  value?: string
  name?: string // with prefix
  color?: string
  description?: string
  withoutLeadingColor?: string
}

export type ActivityObject = {
  id?: number
  value?: string
  color: string
  description?: string
  name: string
}

class Activity {
  static labelPrefix: string = "@activity:"
  static zodUtil = z.custom<Activity>((val) => val instanceof Activity && !!val.name, "Invalid activity")

  id: ActivityProps["id"]
  value: ActivityProps["value"]
  color: tinycolor.Instance
  description: ActivityProps["description"]

  constructor(props: ActivityProps) {
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

  private validateProps(props: ActivityProps) {
    const { description } = props
    if (description && description.length > 100) {
      throw new Error("Label description is too long")
    }
  }

  get name() {
    return Activity.labelPrefix + this.value
  }

  set name(str: string) {
    if (!str.startsWith(Activity.labelPrefix)) {
      throw Error("Invalid label value")
    }
    this.value = str.replace(Activity.labelPrefix, "")
  }

  get withoutLeadingColor(): string | undefined {
    return this.color?.toHex()
  }

  set withoutLeadingColor(str: string) {
    this.color = tinycolor(str)
  }

  update(props: Partial<ActivityProps>) {
    return new Activity({ ...this, ...props })
  }

  toObject(callbackFunc: (obj: ActivityObject) => any = (obj) => obj) {
    return callbackFunc({
      id: this.id,
      value: this.value,
      color: this.color?.toHex(),
      description: this.description,
      name: this.name,
    })
  }
}

export default Activity
