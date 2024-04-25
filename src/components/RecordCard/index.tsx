import Activity from "@/models/activity"
import Record from "@/models/record"
import { trpc } from "@/trpc/client"
import { twclx } from "@/utils/twclx"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { RiTimeFill } from "@remixicon/react"
import { When } from "react-if"
import ActivityCard from "../ActivityCard"

export type RecordCardProps = {
  record: Record
  className?: string
  onDelete?: () => void
}

const RecordCard = ({ record, className, onDelete }: RecordCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const deleteMutation = trpc.record.delete.useMutation()

  const editRecord = () => {
    window.location.href = `/records/edit?number=${record.number}`
  }

  const deleteRecord = async () => {
    if (record.nodeId) {
      await deleteMutation.mutateAsync({
        issueNodeId: record.nodeId,
      })
      onDelete?.()
    }
  }

  return (
    <>
      <Card isPressable onPress={onOpen} className={twclx(["w-full", className])}>
        <CardHeader>
          <RiTimeFill size={"1rem"} />
          <span className="ml-2">
            {record.start.format("HH:mm:ss")} - {record.end.format("HH:mm:ss")}
          </span>
        </CardHeader>
        <When condition={!!record.activity?.value}>
          <CardBody className="py-0">
            <div className="w-auto">
              <ActivityCard
                pressable={false}
                classNames={{
                  card: twclx(["!outline-none"]),
                  cardHeader: twclx([" !text-lg"]),
                }}
                activity={
                  new Activity({
                    value: record.activity?.value,
                    description: "",
                    color: record.activity?.color.toPercentageRgbString(),
                  })
                }
              />
            </div>
          </CardBody>
        </When>
        <When condition={!!record.description}>
          <CardFooter className="text-start">{record.description}</CardFooter>
        </When>
      </Card>

      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Record</ModalHeader>
          <ModalBody>
            <Button color="primary" size="lg" onPress={editRecord}>
              Edit
            </Button>
            <Button color="danger" size="lg" onPress={deleteRecord}>
              Delete
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}

export default RecordCard
