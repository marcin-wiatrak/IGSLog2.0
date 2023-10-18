import { prisma } from '@server/db'

const handler = async (req, res) => {
  await prisma.user
    .findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        suspended: true,
        hidden: true,
      },
      orderBy: {
        lastName: 'asc',
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
