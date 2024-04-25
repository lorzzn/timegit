"use client"

import Logo from "@/components/Logo"
import useBodyTheme from "@/hooks/useBodyTheme"
import { twclx } from "@/utils/twclx"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton, User } from "@nextui-org/react"
import { RiMoonFill, RiSunFill } from "@remixicon/react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Else, If, Then } from "react-if"

const Header = () => {
  const { theme, setTheme } = useBodyTheme()
  const session = useSession()
  const authed = session.status === "authenticated" && session.data.user

  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <header
      className={twclx([
        "w-full flex justify-between items-center h-12 bg-foreground-50 px-6 sm:px-12 backdrop-blur sticky top-0 shadow z-40",
      ])}
    >
      <Link className={twclx(["mr-24"])} href="/">
        <Logo />
      </Link>

      <div className={twclx(["flex space-x-4 items-center"])}>
        <Skeleton isLoaded={!!theme} className="h-8 rounded">
          <Button isIconOnly radius="sm" size="sm" variant="light" onPress={changeTheme}>
            {theme === "light" && <RiSunFill size={"1.25rem"} />}
            {theme === "dark" && <RiMoonFill size={"1.25rem"} />}
          </Button>
        </Skeleton>

        <Skeleton isLoaded={session.status !== "loading"} className="rounded">
          <If condition={!!authed}>
            <Then>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" className="px-3">
                    <User
                      name={session.data?.user?.name}
                      description={session.data?.user?.email}
                      avatarProps={{
                        size: "sm",
                        src: session.data?.user?.image || undefined,
                      }}
                    />
                  </Button>
                </DropdownTrigger>

                <DropdownMenu aria-label="user menu">
                  <DropdownItem textValue="sign out" onPress={() => signOut()}>
                    <span>sign out</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Then>

            <Else>
              <Button
                onPress={() => signIn()}
                radius="sm"
                size="sm"
                variant="bordered"
                color="primary"
                className="font-semibold"
              >
                Sign in
              </Button>
            </Else>
          </If>
        </Skeleton>
      </div>
    </header>
  )
}

export default Header
