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
  Progress,
  useDisclosure,
} from "@nextui-org/react"
import { RiAddFill, RiArrowLeftLine, RiRefreshLine } from "@remixicon/react"
import useInfiniteScroll from "beautiful-react-hooks/useInfiniteScroll"
import { pick } from "lodash"
import { RefObject, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
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

  const list = trpc.activity.list.useInfiniteQuery(
    {
      repository_id: repoId,
      limit: 30,
    },
    {
      enabled: !!repoId && isOpen,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  // status
  const isLoading = list.isFetching || createMutation.isPending
  const items = list.data?.pages.flatMap((page) => page.items) || []
  const isEmpty = !list.isFetching && list.isFetched && items.length === 0

  // infinite scroll
  const modalref = useRef<HTMLDivElement>(null)
  const infiniteScrollElementRef = useMemo(() => {
    let current = null
    if (modalref.current) {
      current = modalref.current.querySelector("#infinity-scroll-element")
    }
    return { current } as RefObject<HTMLElement>
  }, [modalref.current])
  const onInfiniteScroll = useInfiniteScroll(infiniteScrollElementRef)

  onInfiniteScroll(() => {
    if (isLoading) return

    loadNextPage()
  })

  useEffect(() => {
    updateCurrent()
  }, [isLoading])

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

  const loadNextPage = () => {
    if (list.hasNextPage) {
      list.fetchNextPage()
    }
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

      <Modal size="full" isOpen={isOpen} onClose={onClose} ref={modalref}>
        <ModalContent>
          <ModalHeader>
            <span>Select an activity</span>
          </ModalHeader>

          <ModalBody
            id="infinity-scroll-element"
            className={twclx(["flex flex-col relative items-center overflow-y-auto"])}
          >
            <When condition={isLoading}>
              <Progress
                aria-label="loading"
                size="sm"
                isIndeterminate
                className="absolute left-0 right-0 top-0 pointer-events-none"
              />
            </When>
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
                  {items.map((item) => {
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

              <When condition={list.hasNextPage && !isEmpty}>
                <div className="flex justify-center py-6">
                  <Button variant="light" color="primary" isLoading={isLoading} onPress={loadNextPage}>
                    Load more
                  </Button>
                </div>
              </When>

              <When condition={isEmpty}>
                <div className="flex-1 flex flex-col items-center text-foreground-400">
                  <span className="flex-1 flex items-center justify-center">No activities found.</span>
                </div>
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
          <ModalHeader>Activity</ModalHeader>
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
