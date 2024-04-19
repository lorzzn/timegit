import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const options: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_OAUTH_SECRET!,
    }),
  ],
}

function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, options)
}

export { AuthHandler as GET, AuthHandler as POST }
