import { twclx } from "@/utils/twclx"
import { css } from "@emotion/css"
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"

export type TCardProps = {
  header?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  footerIsError?: boolean
  width?: string
  classNames?: {
    card?: string
    header?: string
    body?: string
    footer?: string
  }
}

const TCard = (props: TCardProps) => {
  return (
    <Card
      className={twclx([
        "p-4",
        props.width &&
          css`
            width: ${props.width};
          `,
        props.classNames?.card,
      ])}
    >
      <CardHeader
        className={twclx(["flex items-center justify-center", { hidden: !props.header }, props.classNames?.header])}
      >
        {typeof props.header === "string" ? <h1 className="text-xl font-bold mr-2">{props.header}</h1> : props.header}
      </CardHeader>
      <CardBody className={twclx([{ hidden: !props.content && !props.children }, props.classNames?.body])}>
        {props.content}
        {props.children}
      </CardBody>
      <CardFooter className={twclx([{ hidden: !props.footer }, props.classNames?.footer])}>
        {props.footerIsError ? (
          <div className={twclx(["text-small text-red-600 flex-1 text-center break-words w-0"])}>{props.footer}</div>
        ) : (
          props.footer
        )}
      </CardFooter>
    </Card>
  )
}

export default TCard
