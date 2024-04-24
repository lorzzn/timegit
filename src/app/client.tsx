"use client"

import RecordCard from "@/components/RecordCard"
import { useLayoutContext } from "@/layout/context"
import Record from "@/models/record"
import { trpc } from "@/trpc/client"
import { DayDate, daydate } from "@/utils/daydate"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import {
  Button,
  Calendar,
  CalendarDate,
  DateValue,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Spacer,
  useDisclosure,
} from "@nextui-org/react"
import { RiAddFill } from "@remixicon/react"
import React, { useState } from "react"
import { When } from "react-if"

const App = () => {
  const { serverDate } = useLayoutContext()
  const today = daydate(serverDate)
  const [date, setDate] = useState(daydate(serverDate))
  const [calendarDate, setCalendarDate] = useState(date.toCalendarDate())

  const { isOpen, onOpen, onClose } = useDisclosure()

  const records = trpc.record.list.useQuery(
    {
      date,
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !records.isFetching && records.isFetched && records.data?.length === 0
  const isFetching = records.isFetching

  const showCalendarModal = () => {
    setCalendarDate(date.toCalendarDate())
    onOpen()
  }

  const onCalenderDateChange = (date: DateValue) => {
    setCalendarDate(date as CalendarDate)
  }

  const onCalenderDateConfirm = () => {
    setDate(DayDate.fromCalendarDate(calendarDate))
    onClose()
  }

  const onCreate = () => {
    window.location.href = "/records/create"
  }

  const lineColRenderer = (showdot?: boolean, dotColor?: string) => (
    <div className="line-col flex justify-center">
      <div className="line w-[2px] bg-foreground relative">
        <When condition={showdot}>
          <div
            className={twclx([
              "absolute min-h-3 min-w-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground",
              dotColor &&
                css`
                  background-color: ${dotColor};
                `,
            ])}
          />
        </When>
      </div>
    </div>
  )

  const contentColRenderer = (children: React.ReactNode) => <div className="content-col">{children}</div>

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="pb-2 flex justify-between">
          <Button variant="light" radius="sm" size="lg" onPress={showCalendarModal}>
            {date.format("YYYY / MM / DD")}
          </Button>
          <Button variant="light" radius="sm" size="lg" onPress={onCreate}>
            <RiAddFill />
            <span>Create</span>
          </Button>
        </div>

        {isFetching && (
          <div className="relative">
            <Progress size="sm" isIndeterminate aria-label="Fetching..." className="absolute -translate-y-full" />
          </div>
        )}
        <Divider />

        <div className="flex-1 flex flex-col">
          <When condition={isEmpty}>
            <div className="flex-1 flex flex-col items-center text-foreground-400">
              <span className="flex-1 flex items-center justify-center">No record found.</span>
            </div>
          </When>
          <Spacer y={6} />
          <When condition={!isEmpty}>
            {records.data?.map((record) => {
              const t = Record.fromIssueObject(record)
              console.log(t)
              const activityColor = t.activity?.color.toPercentageRgbString()

              return (
                <div className="grid grid-cols-[30px_auto]" key={t.id}>
                  {lineColRenderer(true, activityColor)}
                  {contentColRenderer(<RecordCard record={t} className="my-3" />)}
                </div>
              )
            })}
          </When>
        </div>
      </div>

      {/* Calendar modal */}
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Calendar</ModalHeader>
          <ModalBody>
            <Calendar
              aria-label="Calendar"
              className="shadow-none"
              maxValue={today.toCalendarDate()}
              defaultValue={calendarDate}
              value={calendarDate}
              onChange={onCalenderDateChange}
              hideDisabledDates
              showShadow={false}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={onCalenderDateConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default App
