import { TRPCError } from "@trpc/server"
import { get } from "lodash"

export class TRPCGhapiError extends TRPCError {
  response?: Response

  constructor(props: any) {
    super(props)
    this.response = get(props, "response")
  }
}
