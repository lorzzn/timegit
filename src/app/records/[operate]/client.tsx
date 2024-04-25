"use client"

import ActivityPicker from "@/components/ActivityPicker"
import { useLayoutContext } from "@/layout/context"
import Activity from "@/models/activity"
import Record from "@/models/record"
import { trpc } from "@/trpc/client"
import { daydate } from "@/utils/daydate"
import { twclx } from "@/utils/twclx"
import { ZonedDateTime } from "@internationalized/date"
import {
  Button,
  DateInput,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  TimeInput,
  useDisclosure,
} from "@nextui-org/react"
import { RiCheckboxCircleFill, RiCloseFill, RiErrorWarningFill } from "@remixicon/react"
import { useEffect, useRef, useState } from "react"
import { When } from "react-if"

type OperateProps = {
  operate: string
  number: string
}

const Operate = ({ operate, number: _number }: OperateProps) => {
  const number = Number(_number)
  const data = trpc.record.get.useQuery(
    {
      number: number,
    },
    {
      enabled: operate === "edit" && !!number,
      refetchOnWindowFocus: false,
    },
  )

  const { serverDate } = useLayoutContext()
  const [date, setDate] = useState(daydate(serverDate))
  const [start, setStart] = useState(date.toZonedDateTime())
  const [end, setEnd] = useState(date.toZonedDateTime())
  const [activity, setActivity] = useState<Activity | null>()
  const [description, setDescription] = useState<string>("")

  useEffect(() => {
    if (data.isSuccess) {
      const record = Record.fromIssueObject(data.data)
      setDate(record.date)
      setStart(record.start.toZonedDateTime())
      setEnd(record.end.toZonedDateTime())
      setActivity(record.activity)
      setDescription(record.description)
    }
  }, [data.isSuccess])

  const timeInterval = useRef<ReturnType<typeof setInterval>>()
  useEffect(() => {
    if (operate === "create") {
      timeInterval.current = setInterval(() => {
        setStart(daydate().toZonedDateTime())
      }, 1000)
    }

    return () => {
      clearInterval(timeInterval.current)
    }
  }, [])

  const { isOpen, onClose, onOpen } = useDisclosure()
  const [tipContent, setTipContent] = useState("")
  const { isOpen: tipIsOpen, onClose: tipOnClose, onOpen: tipOnOpen } = useDisclosure()

  const createMutation = trpc.record.create.useMutation()
  const updateMutation = trpc.record.update.useMutation()

  const isPending = createMutation.isPending || updateMutation.isPending
  const isSuccess =
    (createMutation.isSuccess && !createMutation.isPending) || (updateMutation.isSuccess && !updateMutation.isPending)

  const onStartChange = (time: ZonedDateTime) => {
    setStart(time)
  }

  const onEndChange = (time: ZonedDateTime) => {
    setEnd(time)
  }

  useEffect(() => {
    if (isPending) {
      onOpen()
    }
  }, [isPending])

  const onConfirmButtonPress = () => {
    if (daydate(end).isBefore(daydate(start))) {
      setTipContent("End time must be after start time.")
      tipOnOpen()
      return
    }
    if (data.data?.id) {
      updateMutation.mutate({
        number,
        date,
        start: daydate(start),
        end: daydate(end),
        activity: activity?.toObject(),
        description,
      })
    } else {
      createMutation.mutate({
        date,
        start: daydate(start),
        end: daydate(end),
        activity: activity?.toObject(),
        description,
      })
    }
  }

  const backHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="text-2xl py-3 flex items-center justify-between">
        <div>Create a record</div>
        <Button color="primary" size="md" className="px-8" onPress={onConfirmButtonPress}>
          Confirm
        </Button>
      </div>
      <Divider className="my-3" />

      <div className="text-lg py-3">Start {"(read only)"}</div>
      <DateInput aria-label="date" hourCycle={24} isReadOnly className="pointer-events-none" value={start} />

      <div className="text-lg py-3">End</div>
      <div className="flex items-center">
        <TimeInput
          hourCycle={24}
          isRequired
          label={`End Time (${daydate(end).format("YYYY-MM-DD")})`}
          value={end}
          onChange={onEndChange}
        />
      </div>
      <Divider className="my-3" />

      <div className="text-lg py-3 flex items-center justify-between">
        <div>Activity</div>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          radius="full"
          title="remove activity"
          onPress={() => setActivity(undefined)}
        >
          <RiCloseFill />
        </Button>
      </div>
      <ActivityPicker value={activity} onConfirm={setActivity} />

      <Divider className="my-3" />
      <div className="text-lg py-3">Description</div>

      <Textarea
        value={description}
        onValueChange={(value) => setDescription(value)}
        classNames={{
          base: twclx("flex"),
          input: twclx("min-h-64"),
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader />
          <ModalBody className="min-h-48 relative">
            <When condition={isPending}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            </When>
            <When condition={isSuccess}>
              <div className="flex flex-col items-center justify-center pb-12">
                <RiCheckboxCircleFill className="text-green-500" size={"5rem"} />
                <div className="text-2xl">Success!</div>
              </div>
              <Button color="primary" onPress={backHome}>
                Back to home
              </Button>
              <Button onPress={onClose}>Close</Button>
            </When>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>

      <Modal isOpen={tipIsOpen} onClose={tipOnClose}>
        <ModalContent>
          <ModalHeader />
          <ModalBody>
            <div className="flex flex-col items-center justify-center">
              <RiErrorWarningFill className="text-warning" size={"5rem"} />
              <div className="text-2xl pt-6">{tipContent}</div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="lg" color="primary" onPress={tipOnClose} className="flex-1">
              Ok, i got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <When condition={data.isFetching}>
        <Spinner size="lg" className="absolute inset-0 bg-background z-50" />
      </When>
    </div>
  )
}

export default Operate
