import { Button } from "@nextui-org/react"
import Head from "next/head"
import Link from "next/link"

export default function Index() {
  return (
    <div>
      <Head>
        <title>Timegit</title>
      </Head>
      <main>
        <Link href="/login">
          <Button>go login</Button>
        </Link>
      </main>
    </div>
  )
}
