import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { orderId } = req.query
  await prisma.order
    .update({
      data: {
        deleted: true,
      },
      where: {
        id: orderId,
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
