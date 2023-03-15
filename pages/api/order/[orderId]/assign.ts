import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { orderId } = req.query
  const { handleById } = req.body
  await prisma.order
    .update({
      data: {
        handleById,
      },
      where: {
        id: orderId,
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
