"use client"

import { trpc } from "@/trpc/client"
import { calendarDateToDayjs, dayjsToCalendarDate } from "@/utils/date"
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
  useDisclosure,
} from "@nextui-org/react"
import { RiAddFill } from "@remixicon/react"
import dayjs from "dayjs"
import { useState } from "react"

type AppProps = {
  serverDate: number
}

const App = ({ serverDate }: AppProps) => {
  const today = dayjs(serverDate)
  const [date, setDate] = useState(dayjs(serverDate))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [calendarDate, setCalendarDate] = useState(dayjsToCalendarDate(date))

  const day = trpc.day.get.useQuery({
    year: date.year(),
    month: date.month() + 1,
    day: date.date(),
  })
  const mut = trpc.day.create.useMutation()

  const showCalendarModal = () => {
    setCalendarDate(dayjsToCalendarDate(date))
    onOpen()
  }

  const onCalenderDateChange = (date: DateValue) => {
    setCalendarDate(date as CalendarDate)
  }

  const onCalenderDateConfirm = () => {
    setDate(calendarDateToDayjs(calendarDate))
    onClose()
  }

  const onAdd = async () => {
    mut.mutate({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    })
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="pt-6 pb-2 flex justify-between">
          <Button variant="light" radius="sm" size="lg" onClick={showCalendarModal}>
            {date.format("YYYY / MM / DD")}
          </Button>
          <Button variant="light" radius="sm" size="lg" onClick={onAdd}>
            <RiAddFill />
            <span>Add</span>
          </Button>
        </div>
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
              maxValue={dayjsToCalendarDate(today)}
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
