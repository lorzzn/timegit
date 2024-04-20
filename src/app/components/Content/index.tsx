import { twclx } from "@/utils/twclx"

type ContentProps = {
  children?: React.ReactNode
}

const Content = (props: ContentProps) => {
  return <main className={twclx(["flex-1 w-full flex flex-col"])}>{props.children}</main>
}

export default Content
