import dayjs, { Dayjs } from "dayjs"
import { z } from "zod"
import { daydate } from "./daydate"

export const dateFormat = (date: dayjs.ConfigType, template: string = "YYYY/MM/DD HH:mm:ss"): string => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format(template)
  }
  return ""
}

export const dayjsZodUtil = z
  .custom<Dayjs>((val: any) => daydate(val).isValid(), "Invalid date")
  .transform((val) => daydate(val))
