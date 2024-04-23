import { useLayoutContext } from "@/layout/context"
import ActivityTypeModel from "@/models/activityType"
import useLayoutStore from "@/stores/layout"
import { trpc } from "@/trpc/client"
import { twclx } from "@/utils/twclx"
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
import { Else, If, Then, When } from "react-if"
import ActivityTypeCard from "../ActivityTypeCard"

export type ActivityTypePickerProps = {
  onConfirm?: (activityType: ActivityTypeModel) => void
}

export type ActivityTypePickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityTypePicker = forwardRef<ActivityTypePickerRef, ActivityTypePickerProps>(({ onConfirm }, ref) => {
  const widthClass = useLayoutStore((s) => s.widthClass)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { repo } = useLayoutContext()
  const repoId = repo?.id || 0

  const [selectedActivityType, setSelectedActivityType] = useState<ActivityTypeModel | null>()

  const [isCurrentlyCreating, setIsCurrentlyCreating] = useState(false)

  const createMutation = trpc.activityTypes.create.useMutation()

  const activityTypes = trpc.activityTypes.list.useQuery(
    {
      repository_id: repoId,
    },
    {
      enabled: !!repoId && isOpen,
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !activityTypes.isFetching && activityTypes.isFetched && activityTypes.data?.total_count === 0
  const isFetching = activityTypes.isFetching

  useEffect(() => {
    setIsCurrentlyCreating(false)
  }, [isFetching])

  const onConfirmButtonPress = () => {
    if (selectedActivityType) {
      onConfirm?.(selectedActivityType)
    }
    onClose()
  }

  const onCreateButtonPress = () => {
    setSelectedActivityType(new ActivityTypeModel({}))
    setIsCurrentlyCreating(true)
  }

  const onActivityTypeDeleted = () => {
    setSelectedActivityType(null)
    setIsCurrentlyCreating(false)
  }

  const onActivityTypeSave = async (value: ActivityTypeModel) => {
    await createMutation.mutateAsync(value.toObject())
    setIsCurrentlyCreating(false)
    activityTypes.refetch()
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
          <ModalHeader>Select an activity type</ModalHeader>

          <ModalBody className={twclx(["min-h-36 flex flex-col relative items-center"])}>
            <div className={twclx([widthClass])}>
              {/* activities list */}
              <When condition={!isEmpty}>
                <div className="flex flex-col space-y-3">
                  {activityTypes.data?.items.map((activityType) => {
                    const t = new ActivityTypeModel({
                      name: activityType.name,
                      id: activityType.id,
                      color: activityType.color,
                      description: activityType.description || undefined,
                    })

                    return (
                      <ActivityTypeCard
                        key={activityType.id}
                        activityType={t}
                        onPress={() => setSelectedActivityType(t)}
                        onDelete={onActivityTypeDeleted}
                        onChange={(value) => setSelectedActivityType(value)}
                        onSave={(value) => onActivityTypeSave(value)}
                      />
                    )
                  })}
                </div>
              </When>

              {/* when creating, show the card for editing */}
              <If condition={isCurrentlyCreating}>
                <Then>
                  <div className="my-3">
                    <ActivityTypeCard
                      editing
                      activityType={selectedActivityType}
                      onDelete={onActivityTypeDeleted}
                      onChange={(value) => setSelectedActivityType(value)}
                      onSave={(value) => onActivityTypeSave(value)}
                    />
                  </div>
                </Then>
                <Else>
                  <Button variant="bordered" size="lg" className="w-full !py-10 !my-3" onPress={onCreateButtonPress}>
                    <RiAddFill />
                    <span>Create an activity type</span>
                  </Button>
                </Else>
              </If>

              <When condition={isEmpty}>
                <div className="flex-1 flex flex-col items-center text-foreground-400">
                  <span className="flex-1 flex items-center justify-center">No activities found.</span>
                </div>
              </When>

              {/* put loading at the end */}
              <When condition={isFetching || createMutation.isPending}>
                <Spinner size="lg" className="absolute inset-0 bg-background z-50" />
              </When>
            </div>
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
