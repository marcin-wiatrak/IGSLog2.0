import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { returnId } = req.query
  await prisma.return
    .delete({
      where: {
        id: returnId,
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
