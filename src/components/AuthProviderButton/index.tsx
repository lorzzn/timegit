"use client"

import { Button } from "@nextui-org/react"
import { RiGithubFill } from "@remixicon/react"
import { ClientSafeProvider, signIn } from "next-auth/react"

const AuthProviderButton = ({ provider }: { provider: ClientSafeProvider }) => {
  return (
    <Button size="lg" onPress={() => signIn(provider.id)}>
      {provider.id === "github" && <RiGithubFill />}
      <span>Continue with {provider.name}</span>
    </Button>
  )
}

export default AuthProviderButton
