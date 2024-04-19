"use client"

import { twclx } from "@/utils/twclx"
import { Button } from "@nextui-org/react"
import { signIn } from "next-auth/react"
import Link from "next/link"

const Header = () => {
  return (
    <header
      className={twclx(["w-full flex justify-between items-center h-12 bg-foreground-100 px-8 sm:px-28 backdrop-blur"])}
    >
      <Link className={twclx(["font-mono font-bold text-lg"])} href="/">
        Timegit
      </Link>

      <div className={twclx(["flex space-x-4 items-center"])}>
        <Button radius="sm" size="sm" variant="light"></Button>
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
      </div>
    </header>
  )
}

export default Header
