import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { returnId } = req.query
  const data = req.body
  await prisma.return
    .update({
      data,
      where: {
        id: returnId,
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
