import ActivityType from "@/models/activityType"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from "@nextui-org/react"
import { RiDeleteBin2Fill, RiSaveFill } from "@remixicon/react"
import { useRef, useState } from "react"
import { Else, If, Then, When } from "react-if"
import tinycolor from "tinycolor2"
import ColorPickerModal, { ColorPickerModalRef } from "../ColorPickerModal"

type ActivityTypeCardProps = {
  activityType?: ActivityType | null
  editing?: boolean
  onPress?: () => void
  onSave?: (activityType: ActivityType) => void
  onChange?: (activityType?: ActivityType | null) => void
  onDelete?: () => void
  disabledDelete?: boolean
  emptyText?: string
}

const ActivityTypeCard = ({
  activityType: propActivityType,
  onPress,
  editing,
  onSave,
  onChange,
  onDelete,
  disabledDelete,
  emptyText = "No activity type has been specified, click me to add.",
}: ActivityTypeCardProps) => {
  const [activityType, setActivityType] = useState<ActivityType | undefined | null>(propActivityType)

  const colorPickerRef = useRef<ColorPickerModalRef | null>(null)

  const updateActivityType = (key: keyof ActivityType, value: any) => {
    const val = activityType?.update({
      [key]: value,
    })
    onChange?.(val)
    setActivityType(val)
  }

  return (
    <>
      <Card
        isPressable={!editing}
        onPress={onPress}
        shadow="sm"
        className={twclx([
          css`
            background-color: #${activityType?.withoutLeadingColor};
            color: ${tinycolor(activityType?.color).isDark() ? "white" : "black"};
          `,
        ])}
      >
        <If condition={!!activityType}>
          <Then>
            <CardHeader className="text-xl font-medium">
              <If condition={editing}>
                <Then>
                  <Input
                    label="Name"
                    required
                    value={activityType?.value}
                    onValueChange={(value) => updateActivityType("value", value)}
                  />
                </Then>
                <Else>{activityType?.value}</Else>
              </If>
            </CardHeader>

            <CardBody className="py-0">
              <If condition={editing}>
                <Then>
                  <div className="flex flex-col">
                    <Textarea
                      label="Description"
                      maxLength={100}
                      value={activityType?.description}
                      onValueChange={(value) => updateActivityType("description", value)}
                    />
                    <When condition={activityType?.description}>
                      <span className="ml-auto text-sm mt-1 mr-1">{activityType?.description?.length}/100</span>
                    </When>
                  </div>
                </Then>
                <Else>
                  <div className={twclx([{ "pb-3": activityType?.description }])}>{activityType?.description}</div>
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
                <Button className="ml-3" size="md" color="primary" onPress={() => onSave?.(activityType!)}>
                  <RiSaveFill size={"1.1rem"} />
                  <span>Save</span>
                </Button>
              </CardFooter>
            </When>
          </Then>
        </If>

        <When condition={!activityType}>
          <CardBody className="flex justify-center items-center">
            <span className="flex-1 flex items-center justify-center text-foreground-400 text-center">{emptyText}</span>
          </CardBody>
        </When>
      </Card>

      <ColorPickerModal ref={colorPickerRef} onChange={(value) => updateActivityType("color", value.toHexString())} />
    </>
  )
}

export default ActivityTypeCard
