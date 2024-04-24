"use client"

import { useLayoutContext } from "@/layout/context"
import { trpc } from "@/trpc/client"
import { DayDate, daydate } from "@/utils/daydate"
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

const App = () => {
  const { serverDate } = useLayoutContext()
  const today = daydate(serverDate)
  const [date, setDate] = useState(daydate(serverDate))
  const [calendarDate, setCalendarDate] = useState(date.toCalendarDate())

  const { isOpen, onOpen, onClose } = useDisclosure()

  const records = trpc.records.list.useQuery({
    date,
  })
  const mut = trpc.records.create.useMutation()

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

        {records.isFetching && <Progress size="sm" isIndeterminate aria-label="Fetching..." />}
        <Divider />

        <div className="flex-1 flex flex-col"></div>
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
