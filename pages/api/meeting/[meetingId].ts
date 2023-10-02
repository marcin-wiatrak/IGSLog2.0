import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { meetingId } = req.query
  await prisma.meeting
    .findUnique({
      where: {
        id: meetingId,
      },
      include: {
        handleBy: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
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
