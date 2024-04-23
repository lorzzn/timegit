"use client"

import TCard from "@/components/TCard"
import { trpc } from "@/trpc/client"
import { Button, Code, Divider } from "@nextui-org/react"
import { RiGithubFill } from "@remixicon/react"

type SetupProps = {
  repoName?: string
  repoPrivate: boolean
}

const Setup = (props: SetupProps) => {
  const mutation = trpc.repo.create.useMutation()

  const onConfirm = async () => {
    if (props.repoName) {
      mutation.mutate({
        repoName: props.repoName,
        private: props.repoPrivate,
      })
    }
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <TCard header="Setup your app in one step" footer={mutation.error?.message} footerIsError>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col justify-center items-center">
            <RiGithubFill size={"5rem"} />
            <Divider className="my-5" />
          </div>
          <div>
            <span>Create repository</span>
            <Code className="py-0 px-2 mx-1">{props.repoName}</Code>
            <ul className="list-disc text-small my-3 break-words ml-3">
              {props.repoPrivate && (
                <li>
                  <span>The repository will be created as a</span>
                  <strong> private </strong>
                  <span>repository.</span>
                </li>
              )}
            </ul>
          </div>
          <div className="flex mt-10">
            <Button color="primary" className="flex-1" size="lg" onClick={onConfirm} isLoading={mutation.isPending}>
              Confirm
            </Button>
          </div>
        </div>
      </TCard>
    </div>
  )
}

export default Setup
