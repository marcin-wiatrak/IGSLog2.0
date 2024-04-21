import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { meetingId } = req.query
  const data = req.body
  await prisma.meeting
    .update({
      data,
      where: {
        id: meetingId,
      },
    })
    .then((response) => {
      res.status(200).json(response)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
