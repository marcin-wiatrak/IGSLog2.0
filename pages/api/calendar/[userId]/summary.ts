import { prisma } from '@server/db'
import dayjs from 'dayjs'

const handler = async (req, res) => {
  const { userId } = req.query
  const { date } = req.body

  const createdAt = {
    gte: dayjs(date).startOf('day').format(),
    lte: dayjs(date).endOf('day').format(),
  }

  await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
      select: {
        createdBy: {
          where: {
            createdAt,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        returnCreatedBy: {
          where: {
            createdAt,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        meetingAssignedTo: {
          where: {
            createdAt,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    .then((response) => {
      res.status(200).json({ ...response })
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
