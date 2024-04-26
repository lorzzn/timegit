import { CalendarDate, ZonedDateTime } from "@internationalized/date"
import dayjs, { ConfigType, Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { z } from "zod"

dayjs.extend(utc)
dayjs.extend(timezone)

export interface DayDate extends Dayjs {}

export type DayDateConfig = ConfigType | ZonedDateTime

export class DayDate {
  constructor(config?: DayDateConfig) {
    if (config instanceof ZonedDateTime) {
      config = config.toDate()
    }
    Object.assign(this, dayjs.prototype, dayjs(config))
  }

  toCommonString(template: string = "YYYY/MM/DD HH:mm:ss") {
    if (this.isValid()) {
      return this.format(template)
    }
    return ""
  }

  toCalendarDate() {
    return new CalendarDate(this.year(), this.month() + 1, this.date())
  }

  static fromCalendarDate(date: CalendarDate) {
    return new DayDate(date.toDate(dayjs.tz.guess()))
  }

  static tz = dayjs.tz

  static zodUtil = z
    .custom<DayDate>((val: any) => daydate(val).isValid(), "Invalid date")
    .transform((val) => daydate(val).toISOString())

  toZonedDateTime() {
    // dayjs offset use minutes, while ZonedDateTime use milliseconds.
    const offset = this.utcOffset().valueOf() * 60 * 1000
    return new ZonedDateTime(
      this.year(),
      this.month() + 1,
      this.date(),
      daydate.tz.guess(),
      offset,
      this.hour(),
      this.minute(),
      this.second(),
      this.millisecond(),
    )
  }
}

export function daydate(config?: DayDateConfig) {
  return new DayDate(config)
}
daydate.tz = DayDate.tz
daydate.fromCalendarDate = DayDate.fromCalendarDate
daydate.zodUtil = DayDate.zodUtil
