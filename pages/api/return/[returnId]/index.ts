import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { returnId } = req.query
  await prisma.return
    .findUnique({
      where: {
        id: returnId,
      },
      include: {
        handleBy: {
          select: {
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
        registeredBy: {
          select: {
            firstName: true,
            lastName: true,
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
