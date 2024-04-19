"use client"

import { twclx } from "@/utils/twclx"
import { Button } from "@nextui-org/react"
import { signIn } from "next-auth/react"

const Header = () => {
  return (
    <header className={twclx(["w-full flex justify-between items-center h-12 bg-foreground-100 px-28"])}>
      <div>Timegit</div>
      <Button
        onClick={() => signIn()}
        radius="sm"
        size="sm"
        variant="bordered"
        color="primary"
        className="font-semibold"
      >
        signin with Github
      </Button>
    </header>
  )
}

export default Header
