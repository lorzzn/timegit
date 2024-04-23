"use client"

import useLayoutStore from "@/stores/layout"
import { twclx } from "@/utils/twclx"

type ContentProps = {
  children?: React.ReactNode
}

const Content = (props: ContentProps) => {
  const widthClass = useLayoutStore((state) => state.widthClass)

  return (
    <main className={twclx(["flex-1 w-full flex flex-col items-center py-6"])}>
      <div className={twclx(["flex-1 flex flex-col", widthClass])}>{props.children}</div>
    </main>
  )
}

export default Content
