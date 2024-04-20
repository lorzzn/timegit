"use client"

import { providerMap } from "@/auth"
import Logo from "@/components/Logo"
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"
import { RiGithubFill } from "@remixicon/react"
import { signIn, useSession } from "next-auth/react"

export default function Signin() {
  const session = useSession()

  if (session.status === "authenticated") {
    window.location.href = "/"
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="p-4">
        <CardHeader className="flex items-center justify-center">
          <h1 className="text-xl font-bold mr-2">Sign in to</h1>
          <Logo />
        </CardHeader>
        <CardBody>
          {Object.values(providerMap).map((provider) => (
            <Button key={provider.id} size="lg" onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              {provider.id === "github" && <RiGithubFill />}
              <span>Continue with {provider.name}</span>
            </Button>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
