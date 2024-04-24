import Activity from "@/models/activity"
import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from "@nextui-org/react"
import { RiDeleteBin2Fill, RiSaveFill } from "@remixicon/react"
import { useRef } from "react"
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
  className?: string
}

const ActivityCard = ({
  activity,
  onPress,
  editing,
  onSave,
  onChange,
  onDelete,
  disabledDelete,
  emptyText = "No activity has been specified",
  className,
}: ActivityCardProps) => {
  const colorPickerRef = useRef<ColorPickerModalRef | null>(null)

  const updateActivity = (key: keyof Activity, value: any) => {
    const val = activity?.update({
      [key]: value,
    })
    onChange?.(val)
  }

  const bgColor = tinycolor(activity?.color)
  const fgColor = tinycolor(bgColor.isDark() ? "white" : "black")

  return (
    <>
      <Card
        isPressable={!editing}
        onPress={onPress}
        shadow="none"
        className={twclx([
          "break-all text-start",
          css`
            background-color: ${bgColor.toPercentageRgbString()};
            color: ${fgColor.toPercentageRgbString()};
          `,
          className,
        ])}
      >
        <If condition={!!activity}>
          <Then>
            <CardHeader className="text-xl font-medium">
              <If condition={editing}>
                <Then>
                  <Input
                    label="Name"
                    isRequired
                    isClearable
                    value={activity?.value}
                    onValueChange={(value) => updateActivity("value", value)}
                  />
                </Then>
                <Else>{activity?.value}</Else>
              </If>
            </CardHeader>

            <CardBody className={twclx([{ hidden: !activity?.description && !editing }])}>
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
                <Else>{activity?.description}</Else>
              </If>
            </CardBody>

            <When condition={editing}>
              <CardFooter className="flex">
                <Button
                  className="ml-auto bg-gradient-to-tr from-[#c43646] to-[#d876e3] text-white shadow-lg"
                  size="sm"
                  color="default"
                  onPress={() => {
                    colorPickerRef.current?.onOpen()
                  }}
                >
                  Change Color
                </Button>
                <When condition={!disabledDelete}>
                  <Button className="ml-3" color="danger" size="sm" onPress={onDelete}>
                    <RiDeleteBin2Fill size={"1.1rem"} />
                    <span>Delete</span>
                  </Button>
                </When>
                <Button
                  className="ml-3"
                  color="primary"
                  size="sm"
                  onPress={() => activity && onSave?.(activity)}
                  isDisabled={!activity?.value}
                >
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

      <ColorPickerModal
        ref={colorPickerRef}
        defaultColor={activity?.color.toHexString()}
        onChange={(value) => updateActivity("color", value.toHexString())}
      />
    </>
  )
}

export default ActivityCard
