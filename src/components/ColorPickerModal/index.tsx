import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import ColorPicker, { BaseColorPickerProps, Color } from "@rc-component/color-picker"
import { debounce } from "lodash"
import { forwardRef, useImperativeHandle, useState } from "react"
import tinycolor from "tinycolor2"

export type ColorPickerModalProps = BaseColorPickerProps & {
  defaultColor?: string
}

export type ColorPickerModalRef = {
  onOpen: () => void
  onClose: () => void
}

const ColorPickerModal = forwardRef<ColorPickerModalRef, ColorPickerModalProps>(
  ({ onChange, onChangeComplete, defaultColor }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [color, setColor] = useState<string>(tinycolor(defaultColor).toHexString())

    const onColorPickerChange: BaseColorPickerProps["onChange"] = debounce(
      (color) => {
        setColor(color.toHexString())
        onChange?.(color)
      },
      30,
      { maxWait: 100 },
    )

    const onInputColorValueChange = (value: string) => {
      onChange?.(new Color(tinycolor(value).toHexString()))
      setColor(value)
    }

    const onPresetButtonPress = (color: string) => () => {
      onInputColorValueChange(color)
    }

    useImperativeHandle(ref, () => ({
      onOpen,
      onClose,
    }))

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Color Picker</ModalHeader>
          <ModalBody>
            <ColorPicker
              disabledAlpha
              onChange={onColorPickerChange}
              onChangeComplete={onChangeComplete}
              defaultValue={defaultColor}
              value={color}
              className={twclx([
                "!w-auto !bg-transparent !shadow-none",
                css`
                  .rc-color-picker-slider {
                    border-radius: 4px;
                  }
                `,
              ])}
            />
          </ModalBody>

          <ModalFooter className="flex justify-start pt-0 px-8">
            <ButtonGroup>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#d73a4a")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #d73a4a;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#0075ca")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #0075ca;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#cfd3d7")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #cfd3d7;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#a2eeef")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #a2eeef;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#7057ff")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #7057ff;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#008672")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #008672;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#e4e669")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #e4e669;
                  `,
                ])}
              ></Button>
              <Button
                isIconOnly
                onPress={onPresetButtonPress("#d876e3")}
                size="sm"
                className={twclx([
                  "p-0",
                  css`
                    background-color: #d876e3;
                  `,
                ])}
              ></Button>
            </ButtonGroup>

            <Input className="!h-auto flex-1" size="sm" value={color} onValueChange={onInputColorValueChange} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
)

ColorPickerModal.displayName = "ColorPickerModal"
export default ColorPickerModal
