import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { id, name, address, contactName, phoneNumber } = req.body

  await prisma.customer
    .update({
      data: {
        name,
        address,
        phoneNumber,
        contactName,
      },
      where: {
        id,
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
