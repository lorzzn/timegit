import { z } from "zod"

export type ActivityTypeProps = {
  id?: number
  name: string
  color?: string
  description?: string
}

class ActivityType {
  static labelPrefix: string = "@activity:"
  static zodUtil = z.custom<ActivityType>((val) => val instanceof ActivityType, "Invalid activity")

  id: ActivityTypeProps["id"]
  name: ActivityTypeProps["name"]
  color: ActivityTypeProps["color"]
  description: ActivityTypeProps["description"]

  constructor(props: ActivityTypeProps) {
    this.validateProps(props)
    const { name, color, description, id } = props

    this.id = id
    this.name = name
    this.color = color
    this.description = description
  }

  private validateProps(props: ActivityTypeProps) {
    const { description } = props
    if (description && description.length > 100) {
      throw new Error("Label description is too long")
    }
  }

  get labelValue() {
    return `${ActivityType.labelPrefix}${this.name}`
  }

  update(props: Partial<ActivityTypeProps>) {
    return new ActivityType({ ...this, ...props })
  }
}

export default ActivityType
