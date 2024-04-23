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
import { RiAddFill, RiArrowLeftLine, RiRefreshLine } from "@remixicon/react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Else, If, Then, When } from "react-if"
import ActivityTypeCard from "../ActivityTypeCard"

export type ActivityTypePickerProps = {
  onConfirm?: (activityType?: ActivityTypeModel | null) => void
}

export type ActivityTypePickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityTypePicker = forwardRef<ActivityTypePickerRef, ActivityTypePickerProps>(({ onConfirm }, ref) => {
  const widthClass = useLayoutStore((s) => s.widthClass)

  const { isOpen, onOpen, onClose: _onclose } = useDisclosure()
  const { isOpen: actionIsOpen, onOpen: actionOnOpen, onClose: actionOnClose } = useDisclosure()

  const createMutation = trpc.activityTypes.create.useMutation()
  const updateMutation = trpc.activityTypes.update.useMutation()
  const deleteMutation = trpc.activityTypes.delete.useMutation()

  const resetModal = () => {
    setCurrentlyActivityType(null)
    setEditingActivityType(null)
    setIsEditing(false)
  }

  const onClose = () => {
    _onclose()
    actionOnClose()
    resetModal()
  }

  const { repo } = useLayoutContext()
  const repoId = repo?.id || 0

  const [currentlyActivityType, setCurrentlyActivityType] = useState<ActivityTypeModel | null>()
  const [editingActivityType, setEditingActivityType] = useState<ActivityTypeModel | null>()

  const [isEditing, setIsEditing] = useState(false)

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
    resetModal()
  }, [isFetching])

  const onCreateButtonPress = () => {
    setCurrentlyActivityType(new ActivityTypeModel({}))
    setIsEditing(true)
  }

  const onActivityTypeDelete = async () => {
    if (!currentlyActivityType?.name) return

    await deleteMutation.mutateAsync({
      name: currentlyActivityType.name,
    })
    setTimeout(() => {
      activityTypes.refetch()
    }, 1000)
  }

  const onActivityTypeSave = async (value: ActivityTypeModel) => {
    if (!value.id) {
      await createMutation.mutateAsync(value.toObject())
    } else {
      if (!editingActivityType) return
      await updateMutation.mutateAsync({
        ...editingActivityType.toObject(),
        new_name: value.name,
      })
    }
    setTimeout(() => {
      activityTypes.refetch()
    }, 1000)
  }

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }))

  const onSelectActionButtonPress = () => {
    onConfirm?.(currentlyActivityType)
    resetModal()
    onClose()
  }

  const onEditActionButtonPress = () => {
    setIsEditing(true)
    actionOnClose()
  }

  return (
    <>
      <ActivityTypeCard activityType={currentlyActivityType} onPress={onOpen} />

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
                        editing={isEditing && activityType.id === currentlyActivityType?.id}
                        onPress={() => {
                          setEditingActivityType(t)
                          setCurrentlyActivityType(t)
                          actionOnOpen()
                        }}
                        onDelete={onActivityTypeDelete}
                        onChange={(value) => setCurrentlyActivityType(value)}
                        onSave={(value) => onActivityTypeSave(value)}
                      />
                    )
                  })}
                </div>
              </When>

              {/* here is creat at., show the card for editing */}
              <If condition={isEditing && !currentlyActivityType?.id}>
                <Then>
                  <div className="my-3">
                    <ActivityTypeCard
                      editing
                      activityType={currentlyActivityType}
                      onDelete={onActivityTypeDelete}
                      onChange={(value) => setCurrentlyActivityType(value)}
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

          <ModalFooter className="justify-start">
            <Button color="default" variant="light" onPress={() => onClose()}>
              <RiArrowLeftLine />
              <span>Go back</span>
            </Button>
            <Button
              color="default"
              variant="light"
              onPress={() => {
                activityTypes.refetch()
              }}
            >
              <RiRefreshLine />
              <span>Refresh</span>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="sm" isOpen={actionIsOpen} onClose={actionOnClose}>
        <ModalContent>
          <ModalHeader>Select action</ModalHeader>
          <ModalBody>
            <Button color="primary" size="lg" onPress={onSelectActionButtonPress}>
              Select
            </Button>
            <Button color="primary" size="lg" onPress={onEditActionButtonPress}>
              Edit
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
})

ActivityTypePicker.displayName = "ActivityTypePicker"

export default ActivityTypePicker
