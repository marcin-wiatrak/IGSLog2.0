import { prisma } from '@server/db'

const handler = async (req, res) => {
  await prisma.meeting
    .findMany({
      orderBy: {
        createdAt: 'asc',
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
