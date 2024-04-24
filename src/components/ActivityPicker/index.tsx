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
  value?: ActivityModel | null
  onConfirm?: (activity?: ActivityModel | null) => void
}

export type ActivityPickerRef = {
  onOpen: () => void
  onClose: () => void
}

export const ActivityPicker = forwardRef<ActivityPickerRef, ActivityPickerProps>(({ onConfirm, value }, ref) => {
  const widthClass = useLayoutStore((s) => s.widthClass)

  const { isOpen, onOpen, onClose: _onclose } = useDisclosure()
  const { isOpen: actionIsOpen, onOpen: actionOnOpen, onClose: actionOnClose } = useDisclosure()

  const { repo } = useLayoutContext()
  const repoId = repo?.id || 0

  const [currentActivity, setCurrentActivity] = useState<ActivityModel | null>()
  const [currentActivityRawData, setCurrentActivityRawData] = useState<ActivityModel | null>()

  const [isEditing, setIsEditing] = useState(false)

  const createMutation = trpc.activity.create.useMutation()
  const updateMutation = trpc.activity.update.useMutation()
  const deleteMutation = trpc.activity.delete.useMutation()

  const updateCurrent = (activity: ActivityModel | null = null) => {
    setCurrentActivity(activity)
    setCurrentActivityRawData(activity)
    setIsEditing(false)
  }

  const onClose = () => {
    _onclose()
    actionOnClose()
    updateCurrent()
  }

  const list = trpc.activity.list.useQuery(
    {
      repository_id: repoId,
    },
    {
      enabled: !!repoId && isOpen,
      refetchOnWindowFocus: false,
    },
  )

  // status
  const isEmpty = !list.isFetching && list.isFetched && list.data?.total_count === 0
  const isFetching = list.isFetching

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
    list.refetch()
  }

  const onActivitySave = async (activity: ActivityModel) => {
    if (activity.id) {
      if (activity.updated && currentActivityRawData) {
        const res = await updateMutation.mutateAsync({
          ...activity.toObject((val) => ({
            new_name: val.name,
            color: val.color,
            description: val.description,
          })),
          name: currentActivityRawData.name,
        })
        if (res.id === value?.id) {
          onConfirm?.(activity)
        }
        list.refetch()
      } else {
        updateCurrent()
      }
    } else {
      if (activity.value) {
        await createMutation.mutateAsync(activity.toObject((val) => pick(val, ["name", "color", "description"])))
        list.refetch()
      }
    }
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
      <ActivityCard activity={value} onPress={onOpen} className={twclx([{ "!bg-foreground-100": !value }])} />

      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Select an activity</ModalHeader>

          <ModalBody className={twclx(["flex flex-col relative items-center overflow-y-auto"])}>
            <div className={twclx([widthClass])}>
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

              {/* activities list */}
              <When condition={!isEmpty}>
                <div className="flex flex-col space-y-3">
                  {list.data?.items.map((item) => {
                    const t = new ActivityModel({
                      name: item.name,
                      id: item.id,
                      color: item.color,
                      description: item.description || undefined,
                    })
                    const editing = isEditing && t.id === currentActivity?.id

                    return (
                      <ActivityCard
                        key={t.id}
                        activity={editing ? currentActivity : t}
                        editing={editing}
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
                list.refetch()
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
