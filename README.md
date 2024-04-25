This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Florzzn%2Ftimegit&env=GITHUB_OAUTH_CLIENT_ID,GITHUB_OAUTH_SECRET,NEXTAUTH_URL,NEXTAUTH_SECRET,GITHUB_REPOSITORY_NAME,GITHUB_REPOSITORY_PRIVATE)

## Environment Variables

| key                       | description                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NEXTAUTH_URL              | next-auth url, for more information: [next-auth.js.org](https://next-auth.js.org/getting-started/example#deploying-to-production). If you want to use a Vercel domain, you can deploy first, and then change the environment settings in the Vercel dashboard. Remember to update the GitHub OAuth `Homepage URL` and `Authorization callback URL` accordingly. |
| NEXTAUTH_SECRET           | You can generate it by command: `openssl rand -base64 32`                                                                                                                                                                                                                                                                                                       |
| GITHUB_OAUTH_CLIENT_ID    | GitHub OAuth client ID, you can get it by register a GitHub OAuth application [Register a new OAuth application](https://github.com/settings/applications/new)                                                                                                                                                                                                  |
| GITHUB_OAUTH_SECRET       | GitHub OAuth secret                                                                                                                                                                                                                                                                                                                                             |
| GITHUB_REPOSITORY_NAME    | GitHub repo for this app                                                                                                                                                                                                                                                                                                                                        |
| GITHUB_REPOSITORY_PRIVATE | Use a private repository, `true \| false`                                                                                                                                                                                                                                                                                                                       |

## License

[GPL-3.0](https://github.com/Lorzzn/timegit/blob/main/LICENSE) © [Lorzzn](https://github.com/Lorzzn)

## Some Screenshots
