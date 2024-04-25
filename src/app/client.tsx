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
import useWindowScroll from "beautiful-react-hooks/useWindowScroll"
import React, { useRef, useState } from "react"
import { When } from "react-if"

const App = () => {
  const { serverDate } = useLayoutContext()
  const today = daydate(serverDate)
  const [date, setDate] = useState(daydate(serverDate))
  const [calendarDate, setCalendarDate] = useState(date.toCalendarDate())

  const { isOpen, onOpen, onClose } = useDisclosure()

  const records = trpc.record.list.useInfiniteQuery(
    {
      date,
      limit: 3,
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  // status
  const items = records.data?.pages.flatMap((page) => page.items) || []
  const isEmpty = !records.isFetching && records.isFetched && items.length === 0
  const isLoading = records.isFetching

  // infinite scroll
  const onWindowScroll = useWindowScroll()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const onScrollEnd = () => {
    if (isLoading) {
      return
    }
    loadNextPage()
  }

  onWindowScroll((event) => {
    const el = document.documentElement

    if (el) {
      const isBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1
      event.stopPropagation()

      if (isBottom) {
        clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
          onScrollEnd()
          clearTimeout(timeoutRef.current)
        }, 300)
      }
    }
  })

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

  const loadNextPage = () => {
    if (records.hasNextPage) {
      records.fetchNextPage()
    }
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

        <When condition={isLoading}>
          <div className="relative">
            <Progress size="sm" isIndeterminate aria-label="Fetching..." className="absolute -translate-y-full" />
          </div>
        </When>
        <Divider />

        <div className="flex-1 flex flex-col">
          <When condition={isEmpty}>
            <div className="flex-1 flex flex-col items-center text-foreground-400">
              <span className="flex-1 flex items-center justify-center">No record found.</span>
            </div>
          </When>
          <Spacer y={6} />
          <When condition={!isEmpty}>
            {items.map((record) => {
              const t = Record.fromIssueObject(record)
              const activityColor = t.activity?.color.toPercentageRgbString()

              return (
                <div className="grid grid-cols-[30px_auto]" key={t.id}>
                  {lineColRenderer(true, activityColor)}
                  {contentColRenderer(<RecordCard record={t} className="my-3" onDelete={() => records.refetch()} />)}
                </div>
              )
            })}
          </When>

          <When condition={records.hasNextPage && !isEmpty}>
            <div className="flex justify-center py-6">
              <Button variant="light" color="primary" isLoading={isLoading} onPress={loadNextPage}>
                Load more
              </Button>
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
