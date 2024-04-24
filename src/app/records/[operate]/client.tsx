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
import { RiCheckboxCircleFill, RiCloseFill } from "@remixicon/react"
import { useEffect, useState } from "react"
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

  const { isOpen, onClose, onOpen } = useDisclosure()

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

      <div className="text-lg py-3">Start and end time</div>
      <TimeInput hourCycle={24} isRequired label="Start Time" value={start} onChange={onStartChange} />
      <Divider className="my-3" />
      <TimeInput hourCycle={24} isRequired label="End Time" value={end} onChange={onEndChange} />
      <Divider className="my-3" />

      <div className="text-lg py-3 flex items-center justify-between">
        <div>Pick an activity</div>
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

      <When condition={data.isFetching}>
        <Spinner size="lg" className="absolute inset-0 bg-background z-50" />
      </When>
    </div>
  )
}

export default Operate
