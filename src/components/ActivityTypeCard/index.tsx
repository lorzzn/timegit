import ActivityType from "@/models/activityType"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from "@nextui-org/react"
import { RiDeleteBin2Fill, RiSaveFill } from "@remixicon/react"
import { useRef, useState } from "react"
import ColorPickerModal, { ColorPickerModalRef } from "../ColorPickerModal"

type ActivityTypeCardProps = {
  activityType?: ActivityType | null
  editing?: boolean
  onPress?: () => void
  onSave?: (activityType: ActivityType) => void
  onDelete?: () => void
  disabledDelete?: boolean
  emptyText?: string
}

const ActivityTypeCard = ({
  activityType: propActivityType,
  onPress,
  editing,
  onSave,
  onDelete,
  disabledDelete,
  emptyText = "No activity type has been specified",
}: ActivityTypeCardProps) => {
  const [activityType, setActivityType] = useState<ActivityType | null | undefined>(propActivityType)

  const colorPickerRef = useRef<ColorPickerModalRef | null>(null)

  const updateActivityType = (key: keyof ActivityType, value: any) => {
    setActivityType(
      activityType?.update({
        [key]: value,
      }),
    )
  }

  return (
    <>
      <Card
        className={twclx([
          activityType?.color &&
            css`
              background-color: ${activityType.color};
            `,
        ])}
        isPressable={!editing}
        onPress={onPress}
      >
        {activityType && (
          <>
            <CardHeader className="pb-0 text-2xl">
              {editing ? (
                <Input
                  label="Name"
                  required
                  value={activityType.name}
                  onValueChange={(value) => updateActivityType("name", value)}
                />
              ) : (
                activityType.name
              )}
            </CardHeader>

            <CardBody>
              <div>
                {editing ? (
                  <div className="flex flex-col">
                    <Textarea
                      label="Description"
                      maxLength={100}
                      value={activityType.description}
                      onValueChange={(value) => updateActivityType("description", value)}
                    />
                    {activityType.description && (
                      <span className="ml-auto text-sm mt-1 mr-1">{activityType.description.length}/100</span>
                    )}
                  </div>
                ) : (
                  activityType.description
                )}
              </div>
            </CardBody>

            {editing && (
              <CardFooter className="flex">
                <Button
                  className="ml-auto bg-gradient-to-tr from-[#c43646] to-[#d876e3] text-white shadow-lg"
                  size="md"
                  color="default"
                  onPress={() => {
                    colorPickerRef.current?.onOpen()
                  }}
                >
                  Change Color
                </Button>
                {!disabledDelete && (
                  <Button className="ml-3" color="danger" onPress={onDelete}>
                    <RiDeleteBin2Fill size={"1.1rem"} />
                    <span>Delete</span>
                  </Button>
                )}
                <Button className="ml-3" size="md" color="primary" onPress={() => onSave?.(activityType)}>
                  <RiSaveFill size={"1.1rem"} />
                  <span>Save</span>
                </Button>
              </CardFooter>
            )}
          </>
        )}

        {!activityType && (
          <CardBody className="flex justify-center items-center">
            <span className="flex-1 flex items-center justify-center text-foreground-400">{emptyText}</span>
          </CardBody>
        )}
      </Card>

      <ColorPickerModal ref={colorPickerRef} onChange={(value) => updateActivityType("color", value.toHexString())} />
    </>
  )
}

export default ActivityTypeCard
