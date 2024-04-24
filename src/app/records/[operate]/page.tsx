import { redirect } from "next/navigation"
import Operate from "./client"

type CreatePageProps = {
  params: {
    operate: string
  }
  searchParams: {
    number: string
  }
}

const CreatePage = (props: CreatePageProps) => {
  if (!["create", "edit"].includes(props.params.operate)) {
    redirect("/404")
  }
  if (!props.searchParams.number) {
    redirect("/")
  }

  return <Operate number={props.searchParams.number} operate={props.params.operate} />
}

export default CreatePage
