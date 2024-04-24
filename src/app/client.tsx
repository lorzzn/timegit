"use client"

import { useLayoutContext } from "@/layout/context"
import Record from "@/models/record"
import { trpc } from "@/trpc/client"
import { DayDate, daydate } from "@/utils/daydate"
import { twclx } from "@/utils/twclx"
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
  useDisclosure,
} from "@nextui-org/react"
import { RiAddFill } from "@remixicon/react"
import { useState } from "react"
import { When } from "react-if"

const App = () => {
  const { serverDate } = useLayoutContext()
  const today = daydate(serverDate)
  const [date, setDate] = useState(daydate(serverDate))
  const [calendarDate, setCalendarDate] = useState(date.toCalendarDate())

  const { isOpen, onOpen, onClose } = useDisclosure()

  const records = trpc.records.list.useQuery({
    date,
  })

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

          <When condition={!isEmpty}>
            <div className={twclx(["grid grid-cols-[20px_auto]"])}>
              <div className={twclx(["border-l-2 border-foreground-300"])}></div>
              <div className={twclx([""])}>
                {records.data?.map((record) => {
                  const t = Record.fromIssueObject(record)

                  return (
                    <div key={t.id}>
                      <div>{t.start.toString()}</div>
                      <div>{t.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>
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
