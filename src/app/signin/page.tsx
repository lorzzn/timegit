import { auth } from "@/auth"
import AuthProviderButton from "@/components/AuthProviderButton"
import Logo from "@/components/Logo"
import TCard from "@/components/TCard"
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
      <TCard
        header={
          <>
            <h1 className="text-xl font-bold mr-2">Sign in to</h1>
            <Logo />
          </>
        }
      >
        {providers &&
          Object.values(providers).map((provider) => <AuthProviderButton provider={provider} key={provider.id} />)}
      </TCard>
    </div>
  )
}
