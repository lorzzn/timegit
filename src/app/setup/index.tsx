"use client"

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Snippet } from "@nextui-org/react"
import { RiGithubFill } from "@remixicon/react"
import { useSession } from "next-auth/react"

type SetupProps = {
  repoName?: string
  repoPrivate?: string
}

const Setup = (props: SetupProps) => {
  const session = useSession()

  const onConfirm = async () => {
    const repoUrl = ""
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="p-4">
        <CardHeader className="flex items-center justify-center">
          <h1 className="text-xl font-bold mr-2">Setup your app in one step</h1>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col justify-center items-center">
            <RiGithubFill size={"5rem"} />
            <Divider className="my-5" />
          </div>
          <div>
            <span>Create repository</span>
            <Snippet symbol="" hideCopyButton className="py-0 px-2 mx-1">
              {props.repoName}
            </Snippet>
            <ul className="list-disc text-small my-3 break-words ml-3">
              {props.repoPrivate === "true" && (
                <li>
                  <span>The repository will be created as a</span>
                  <strong> private </strong>
                  <span>repository.</span>
                </li>
              )}
            </ul>
          </div>
        </CardBody>

        <CardFooter>
          <Button color="primary" className="flex-1" size="lg" onClick={onConfirm}>
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Setup
