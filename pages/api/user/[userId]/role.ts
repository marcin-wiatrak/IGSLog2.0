import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { userId } = req.query
  const { role } = req.body
  await prisma.user
    .update({
      data: {
        role,
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
