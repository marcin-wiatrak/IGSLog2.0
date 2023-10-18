import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { userId } = req.query
  const { hidden } = req.body
  await prisma.user
    .update({
      data: {
        hidden,
      },
      where: {
        id: userId,
      },
    })
    .then((response) => {
      res.status(200).json({ ...response, status: 'ok' })
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
