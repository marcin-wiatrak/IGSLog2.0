import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { orderId } = req.query
  const { status } = req.body
  await prisma.order
    .update({
      data: {
        status: status,
      },
      where: {
        id: orderId,
      },
    })
    .then((response) => {
      console.log(response)
      res.status(200).json({ ...response, status: 'ok' })
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
