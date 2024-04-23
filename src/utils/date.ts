import { CalendarDate } from "@internationalized/date"
import { DateValue } from "@nextui-org/react"
import dayjs, { Dayjs } from "dayjs"
import { z } from "zod"

export const dateFormat = (date: dayjs.ConfigType, template: string = "YYYY/MM/DD HH:mm:ss"): string => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format(template)
  }
  return ""
}

export const createCalendarDate = (year: number, month: number, date: number) => {
  return new CalendarDate(year, month, date)
}

export const dayjsToCalendarDate = (date: dayjs.Dayjs) => {
  return createCalendarDate(date.year(), date.month() + 1, date.date())
}

export const calendarDateToDayjs = (date: CalendarDate | DateValue) => {
  return dayjs(`${date.year}-${date.month}-${date.day}`)
}

export const dayjsZodUtil = z
  .custom<Dayjs>((val: any) => dayjs(val).isValid(), "Invalid date")
  .transform((val) => dayjs(val))
