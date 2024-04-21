import { auth } from "@/auth"
import AuthProviderButton from "@/components/AuthProviderButton"
import Logo from "@/components/Logo"
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { getProviders } from "next-auth/react"
import { redirect } from "next/navigation"

export default async function Signin() {
  const session = await auth()

  if (!!session) {
    redirect("/")
  }

  const providers = await getProviders()

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="p-4">
        <CardHeader className="flex items-center justify-center">
          <h1 className="text-xl font-bold mr-2">Sign in to</h1>
          <Logo />
        </CardHeader>
        <CardBody>
          {providers &&
            Object.values(providers).map((provider) => <AuthProviderButton provider={provider} key={provider.id} />)}
        </CardBody>
      </Card>
    </div>
  )
}
