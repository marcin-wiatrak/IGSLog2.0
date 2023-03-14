import { prisma } from '@server/db'

const handler = async (req, res) => {
  await prisma.customer
    .findMany({
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        address: true,
        contactName: true,
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
