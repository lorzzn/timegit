"use client"

import ActivityTypePicker from "@/components/ActivityTypePicker"
import { useLayoutContext } from "@/layout/context"
import { daydate } from "@/utils/daydate"
import { twclx } from "@/utils/twclx"
import { ZonedDateTime } from "@internationalized/date"
import { Button, Divider, Textarea, TimeInput } from "@nextui-org/react"
import { RiCloseFill } from "@remixicon/react"
import { useState } from "react"

const Create = () => {
  const { serverDate } = useLayoutContext()
  const today = daydate(serverDate)
  const [start, setStart] = useState(today.toZonedDateTime())
  const [end, setEnd] = useState(today.toZonedDateTime())

  const onStartChange = (time: ZonedDateTime) => {
    setStart(time)
  }

  const onEndChange = (time: ZonedDateTime) => {
    setEnd(time)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-2xl py-3 flex items-center justify-between">
        <div>Create an activity</div>
        <Button color="primary" size="md" className="px-8">
          Confirm
        </Button>
      </div>
      <Divider className="my-3" />

      <div className="text-lg py-3">Input start and end time</div>
      <TimeInput hourCycle={24} isRequired label="Start Time" value={start} onChange={onStartChange} />
      <Divider className="my-3" />
      <TimeInput hourCycle={24} isRequired label="End Time" value={end} onChange={onEndChange} />
      <Divider className="my-3" />

      <div className="text-lg py-3 flex items-center justify-between">
        <div>Pick an activity type</div>
        <Button size="sm" isIconOnly variant="light" radius="full" title="remove activity type">
          <RiCloseFill />
        </Button>
      </div>
      <ActivityTypePicker />

      <Divider className="my-3" />
      <div className="text-lg py-3">Activity description</div>

      <Textarea
        classNames={{
          base: twclx("flex"),
          input: twclx("resize-y min-h-64"),
        }}
      />
    </div>
  )
}

export default Create
