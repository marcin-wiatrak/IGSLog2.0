import { prisma } from '@server/db'

const handler = async (req, res) => {
  await prisma.order
    .findMany({
      where: {
        deleted: false,
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
        handleBy: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
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
