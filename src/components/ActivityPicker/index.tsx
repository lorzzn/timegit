import { useLayoutContext } from "@/layout/context"
import ActivityModel from "@/models/activity"
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
import { pick } from "lodash"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Else, If, Then, When } from "react-if"
import ActivityCard from "../ActivityCard"

export type ActivityPickerProps = {
  onConfirm?: (activity?: ActivityModel | null) => void
}

export type ActivityPickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityPicker = forwardRef<ActivityPickerRef, ActivityPickerProps>(({ onConfirm }, ref) => {
  const widthClass = useLayoutStore((s) => s.widthClass)

  const { isOpen, onOpen, onClose: _onclose } = useDisclosure()
  const { isOpen: actionIsOpen, onOpen: actionOnOpen, onClose: actionOnClose } = useDisclosure()

  const createMutation = trpc.activities.create.useMutation()
  const updateMutation = trpc.activities.update.useMutation()
  const deleteMutation = trpc.activities.delete.useMutation()

  const { repo } = useLayoutContext()
  const repoId = repo?.id || 0

  const [currentActivity, setCurrentActivity] = useState<ActivityModel | null>()
  const [currentEditingActivity, setCurrentEditingActivity] = useState<ActivityModel | null>()

  const [isEditing, setIsEditing] = useState(false)

  const updateCurrent = (activity: ActivityModel | null = null) => {
    setCurrentActivity(activity)
    setCurrentEditingActivity(activity)
    setIsEditing(false)
  }

  const onClose = () => {
    _onclose()
    actionOnClose()
    updateCurrent()
  }

  const activitys = trpc.activities.list.useQuery(
    {
      repository_id: repoId,
    },
    {
      enabled: !!repoId && isOpen,
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !activitys.isFetching && activitys.isFetched && activitys.data?.total_count === 0
  const isFetching = activitys.isFetching

  useEffect(() => {
    updateCurrent()
  }, [isFetching])

  const onCreateButtonPress = () => {
    setCurrentActivity(new ActivityModel({}))
    setIsEditing(true)
  }

  const onActivityDelete = async () => {
    if (!currentActivity?.id) {
      updateCurrent()
      return
    }

    await deleteMutation.mutateAsync({
      name: currentActivity.name,
    })
    setTimeout(() => {
      activitys.refetch()
    }, 1000)
  }

  const onActivitySave = async (value: ActivityModel) => {
    if (!value.id) {
      await createMutation.mutateAsync(value.toObject((val) => pick(val, ["name", "color", "description"])))
    } else {
      if (!currentEditingActivity) return
      await updateMutation.mutateAsync({
        ...currentEditingActivity.toObject(),
        new_name: value.name,
      })
    }
    setTimeout(() => {
      activitys.refetch()
    }, 1000)
  }

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }))

  const onSelectActionButtonPress = () => {
    onConfirm?.(currentActivity)
    updateCurrent()
    onClose()
  }

  const onEditActionButtonPress = () => {
    setIsEditing(true)
    actionOnClose()
  }

  return (
    <>
      <ActivityCard activity={currentActivity} onPress={onOpen} />

      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Select an activity</ModalHeader>

          <ModalBody className={twclx(["min-h-36 flex flex-col relative items-center"])}>
            <div className={twclx([widthClass])}>
              {/* activities list */}
              <When condition={!isEmpty}>
                <div className="flex flex-col space-y-3">
                  {activitys.data?.items.map((activity) => {
                    const t = new ActivityModel({
                      name: activity.name,
                      id: activity.id,
                      color: activity.color,
                      description: activity.description || undefined,
                    })

                    return (
                      <ActivityCard
                        key={activity.id}
                        activity={t}
                        editing={isEditing && activity.id === currentActivity?.id}
                        onPress={() => {
                          updateCurrent(t)
                          actionOnOpen()
                        }}
                        onDelete={onActivityDelete}
                        onChange={(value) => setCurrentActivity(value)}
                        onSave={(value) => onActivitySave(value)}
                      />
                    )
                  })}
                </div>
              </When>

              {/* here is creat activity., show the card for editing */}
              <If condition={isEditing && !currentActivity?.id}>
                <Then>
                  <div className="my-3">
                    <ActivityCard
                      editing
                      activity={currentActivity}
                      onDelete={onActivityDelete}
                      onChange={(value) => setCurrentActivity(value)}
                      onSave={(value) => onActivitySave(value)}
                    />
                  </div>
                </Then>
                <Else>
                  <Button variant="bordered" size="lg" className="w-full !py-10 !my-3" onPress={onCreateButtonPress}>
                    <RiAddFill />
                    <span>Create an activity</span>
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
                activitys.refetch()
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

ActivityPicker.displayName = "ActivityPicker"

export default ActivityPicker
