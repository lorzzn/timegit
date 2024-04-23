import Activity from "@/models/activity"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from "@nextui-org/react"
import { RiDeleteBin2Fill, RiSaveFill } from "@remixicon/react"
import { useRef, useState } from "react"
import ColorPickerModal, { ColorPickerModalRef } from "../ColorPickerModal"

type ActivityCardProps = {
  activity?: Activity | null
  editing?: boolean
  onPress?: () => void
  onSave?: (activity: Activity) => void
  onDelete?: () => void
  disabledDelete?: boolean
}

const ActivityCard = ({
  activity: propActivity,
  onPress,
  editing,
  onSave,
  onDelete,
  disabledDelete,
}: ActivityCardProps) => {
  const [activity, setActivity] = useState<Activity>(
    propActivity ||
      new Activity({
        name: "Reading",
        color: "#7cc36e",
        description: "Reading is a great way to relax and improve your mental health.",
      }),
  )

  const colorPickerRef = useRef<ColorPickerModalRef | null>(null)

  const updateActivity = (key: keyof Activity, value: any) => {
    setActivity(
      activity.update({
        [key]: value,
      }),
    )
  }

  return (
    <>
      <Card
        className={twclx([
          activity.color &&
            css`
              background-color: ${activity.color};
            `,
        ])}
        isPressable={!editing}
        onPress={onPress}
      >
        <CardHeader className="pb-0 text-2xl">
          {editing ? (
            <Input
              label="Name"
              required
              value={activity.name}
              onValueChange={(value) => updateActivity("name", value)}
            />
          ) : (
            activity.name
          )}
        </CardHeader>

        <CardBody>
          <div>
            {editing ? (
              <div className="flex flex-col">
                <Textarea
                  label="Description"
                  maxLength={100}
                  value={activity.description}
                  onValueChange={(value) => updateActivity("description", value)}
                />
                {activity.description && (
                  <span className="ml-auto text-sm mt-1 mr-1">{activity.description.length}/100</span>
                )}
              </div>
            ) : (
              activity.description
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
            <Button className="ml-3" size="md" color="primary" onPress={() => onSave?.(activity)}>
              <RiSaveFill size={"1.1rem"} />
              <span>Save</span>
            </Button>
          </CardFooter>
        )}
      </Card>

      <ColorPickerModal ref={colorPickerRef} onChange={(value) => updateActivity("color", value.toHexString())} />
    </>
  )
}

export default ActivityCard
