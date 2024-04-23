import { useLayoutContext } from "@/layout/context"
import { default as Activity, default as ActivityModel } from "@/models/activity"
import { trpc } from "@/trpc/client"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react"
import { RiAddFill } from "@remixicon/react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import ActivityCard from "../ActivityCard"

export type ActivityPickerProps = {
  onConfirm?: (activity: Activity) => void
}

export type ActivityPickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityPicker = forwardRef<ActivityPickerRef, ActivityPickerProps>(({ onConfirm }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { repo } = useLayoutContext()
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel | null>()
  const [newActivity, setNewActivity] = useState<ActivityModel | null>()

  const activities = trpc.activities.list.useQuery(
    {
      repository_id: repo?.id,
    },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !activities.isFetching && activities.isFetched && activities.data?.total_count === 0
  const isFetching = activities.isFetching

  useEffect(() => {
    setNewActivity(null)
  }, [isFetching])

  const onConfirmButtonPress = () => {
    if (selectedActivity) {
      onConfirm?.(selectedActivity)
    }
    onClose()
  }

  const onCreateButtonPress = () => {
    setNewActivity(
      new ActivityModel({
        name: "",
        description: "",
      }),
    )
  }

  const onNewActitityCancel = () => {
    setNewActivity(null)
  }

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }))

  return (
    <>
      <ActivityCard activity={selectedActivity} onPress={onOpen} />
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Active Manager</ModalHeader>

          <ModalBody className="min-h-36 flex flex-col relative">
            {newActivity && <ActivityCard activity={newActivity} editing onDelete={onNewActitityCancel} />}
            {isEmpty && !newActivity && (
              <div className="flex-1 flex flex-col items-center text-foreground-400">
                <Button variant="bordered" size="lg" className="w-full !py-10" onPress={onCreateButtonPress}>
                  <RiAddFill />
                  <span>Create an activity type</span>
                </Button>
                <span className="flex-1 flex items-center justify-center">No activities found.</span>
              </div>
            )}

            {/* put loading at the end */}
            {isFetching && <Spinner size="lg" className="absolute inset-0 bg-background" />}
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => onConfirmButtonPress()}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})

ActivityPicker.displayName = "ActivityPicker"

export default ActivityPicker
