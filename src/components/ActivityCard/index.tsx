import Activity from "@/models/activity"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from "@nextui-org/react"
import { RiDeleteBin2Fill, RiSaveFill } from "@remixicon/react"
import { useRef, useState } from "react"
import { Else, If, Then, When } from "react-if"
import tinycolor from "tinycolor2"
import ColorPickerModal, { ColorPickerModalRef } from "../ColorPickerModal"

type ActivityCardProps = {
  activity?: Activity | null
  editing?: boolean
  onPress?: () => void
  onSave?: (activity: Activity) => void
  onChange?: (activity?: Activity | null) => void
  onDelete?: () => void
  disabledDelete?: boolean
  emptyText?: string
}

const ActivityCard = ({
  activity: propActivity,
  onPress,
  editing,
  onSave,
  onChange,
  onDelete,
  disabledDelete,
  emptyText = "No activity has been specified, click me to choose.",
}: ActivityCardProps) => {
  const [activity, setActivity] = useState<Activity | undefined | null>(propActivity)

  const colorPickerRef = useRef<ColorPickerModalRef | null>(null)

  const updateActivity = (key: keyof Activity, value: any) => {
    const val = activity?.update({
      [key]: value,
    })
    onChange?.(val)
    setActivity(val)
  }

  return (
    <>
      <Card
        isPressable={!editing}
        onPress={onPress}
        shadow="sm"
        className={twclx([
          css`
            background-color: #${activity?.withoutLeadingColor};
            color: ${tinycolor(activity?.color).isDark() ? "white" : "black"};
          `,
        ])}
      >
        <If condition={!!activity}>
          <Then>
            <CardHeader className="text-xl font-medium">
              <If condition={editing}>
                <Then>
                  <Input
                    label="Name"
                    required
                    value={activity?.value}
                    onValueChange={(value) => updateActivity("value", value)}
                  />
                </Then>
                <Else>{activity?.value}</Else>
              </If>
            </CardHeader>

            <CardBody className="py-0">
              <If condition={editing}>
                <Then>
                  <div className="flex flex-col">
                    <Textarea
                      label="Description"
                      maxLength={100}
                      value={activity?.description}
                      onValueChange={(value) => updateActivity("description", value)}
                    />
                    <When condition={activity?.description}>
                      <span className="ml-auto text-sm mt-1 mr-1">{activity?.description?.length}/100</span>
                    </When>
                  </div>
                </Then>
                <Else>
                  <div className={twclx([{ "pb-3": activity?.description }])}>{activity?.description}</div>
                </Else>
              </If>
            </CardBody>

            <When condition={editing}>
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
                <When condition={!disabledDelete}>
                  <Button className="ml-3" color="danger" onPress={onDelete}>
                    <RiDeleteBin2Fill size={"1.1rem"} />
                    <span>Delete</span>
                  </Button>
                </When>
                <Button className="ml-3" size="md" color="primary" onPress={() => onSave?.(activity!)}>
                  <RiSaveFill size={"1.1rem"} />
                  <span>Save</span>
                </Button>
              </CardFooter>
            </When>
          </Then>
        </If>

        <When condition={!activity}>
          <CardBody className="flex justify-center items-center">
            <span className="flex-1 flex items-center justify-center text-foreground-400 text-center">{emptyText}</span>
          </CardBody>
        </When>
      </Card>

      <ColorPickerModal ref={colorPickerRef} onChange={(value) => updateActivity("color", value.toHexString())} />
    </>
  )
}

export default ActivityCard
