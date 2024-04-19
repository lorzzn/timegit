import { Button, NextUIProvider } from "@nextui-org/react"
import Link from "next/link"

export default function Index() {
  return (
    <NextUIProvider>
      <main>
        <Link href="/login">
          <Button>你好，登录！</Button>
        </Link>
      </main>
    </NextUIProvider>
  )
}
