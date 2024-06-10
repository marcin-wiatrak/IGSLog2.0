import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { meetingId } = req.query
  await prisma.meeting
    .update({
      data: {
        deleted: true,
      },
      where: {
        id: meetingId,
      },
    })
    .then(() => {
      res.status(200).json({ isOk: true })
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
