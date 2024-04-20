import { twclx } from "@/utils/twclx"

type ContentProps = {
  children?: React.ReactNode
}

const Content = (props: ContentProps) => {
  return <main className={twclx(["flex-1 w-full flex flex-col px-8 sm:px-36 pt-8"])}>{props.children}</main>
}

export default Content
