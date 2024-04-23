import { useLayoutContext } from "@/layout/context"
import ActivityTypeModel from "@/models/activityType"
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
import ActivityTypeCard from "../ActivityTypeCard"

export type ActivityTypePickerProps = {
  onConfirm?: (activityType: ActivityTypeModel) => void
}

export type ActivityTypePickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityTypePicker = forwardRef<ActivityTypePickerRef, ActivityTypePickerProps>(({ onConfirm }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { repo } = useLayoutContext()
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityTypeModel | null>()
  const [newActivityType, setNewActivityType] = useState<ActivityTypeModel | null>()

  const activityTypes = trpc.activityTypes.list.useQuery(
    {
      repository_id: repo?.id,
    },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !activityTypes.isFetching && activityTypes.isFetched && activityTypes.data?.total_count === 0
  const isFetching = activityTypes.isFetching

  useEffect(() => {
    setNewActivityType(null)
  }, [isFetching])

  const onConfirmButtonPress = () => {
    if (selectedActivityType) {
      onConfirm?.(selectedActivityType)
    }
    onClose()
  }

  const onCreateButtonPress = () => {
    setNewActivityType(
      new ActivityTypeModel({
        name: "",
        description: "",
      }),
    )
  }

  const onNewActivityTypeCancel = () => {
    setNewActivityType(null)
  }

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }))

  return (
    <>
      <ActivityTypeCard activityType={selectedActivityType} onPress={onOpen} />
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Active Manager</ModalHeader>

          <ModalBody className="min-h-36 flex flex-col relative">
            {newActivityType && (
              <ActivityTypeCard activityType={newActivityType} editing onDelete={onNewActivityTypeCancel} />
            )}
            <div className="flex-1 flex flex-col items-center text-foreground-400">
              {!newActivityType && (
                <Button variant="bordered" size="lg" className="w-full !py-10" onPress={onCreateButtonPress}>
                  <RiAddFill />
                  <span>Create an activity type</span>
                </Button>
              )}
              {isEmpty && <span className="flex-1 flex items-center justify-center">No activities found.</span>}
            </div>

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

ActivityTypePicker.displayName = "ActivityTypePicker"

export default ActivityTypePicker
