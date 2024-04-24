import tinycolor from "tinycolor2"
import { z } from "zod"

export type ActivityProps = {
  id?: number
  value?: string
  name?: string // with prefix
  color?: string
  description?: string
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
  static zodUtil = z
    .custom<Activity>((val) => {
      const t = new Activity(val as any)
      return t.isValid()
    }, "Invalid activity")
    .transform((val) => {
      return new Activity(val as any)
    })

  id: ActivityProps["id"]
  value: ActivityProps["value"]
  color: tinycolor.Instance
  description: ActivityProps["description"]
  updated: boolean

  constructor(props: ActivityProps & { updated?: boolean }) {
    this.validateProps(props)
    const { value, color, description, id, name, updated } = props

    this.id = id
    this.value = value
    this.color = tinycolor(color)
    this.description = description
    this.updated = updated ?? false

    if (name) {
      this.name = name
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

  isValid() {
    return this.value && this.color && this.color.isValid()
  }

  update(props: Partial<ActivityProps>) {
    return new Activity({ ...this, ...props, updated: true })
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
