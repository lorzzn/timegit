"use client"

import useBodyTheme from "@/hooks/useBodyTheme"
import { twclx } from "@/utils/twclx"
import { Button } from "@nextui-org/react"
import { RiMoonFill, RiSunFill } from "@remixicon/react"
import { signIn } from "next-auth/react"
import Link from "next/link"

const Header = () => {
  const { theme, setTheme } = useBodyTheme()

  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <header
      className={twclx(["w-full flex justify-between items-center h-12 bg-foreground-100 px-8 sm:px-28 backdrop-blur"])}
    >
      <Link className={twclx(["font-mono font-bold text-lg"])} href="/">
        Timegit
      </Link>
      <div className={twclx(["flex space-x-4 items-center"])}>
        {theme && (
          <Button isIconOnly radius="sm" size="sm" variant="light" onClick={changeTheme}>
            {theme === "light" && <RiSunFill size={"1.25rem"} />}
            {theme === "dark" && <RiMoonFill size={"1.25rem"} />}
          </Button>
        )}
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
