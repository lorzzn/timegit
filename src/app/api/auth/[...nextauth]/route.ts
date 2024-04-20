import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { Provider } from "next-auth/providers/index"

const providers: Provider[] = [
  GitHubProvider({
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GITHUB_OAUTH_SECRET!,
    authorization: { params: { scope: "read:user user:email repo repo:write" } },
    httpOptions: {
      timeout: 100000,
    },
  }),
]

export const providerMap = providers.map((provider: any) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

const options: AuthOptions = {
  providers,
  pages: {
    signIn: "/signin",
  },
}

function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, options)
}

export { AuthHandler as GET, AuthHandler as POST }
