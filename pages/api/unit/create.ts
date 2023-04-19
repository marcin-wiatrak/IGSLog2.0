import { prisma } from '@server/db'

const handler = async (req, res) => {
  const data = req.body
  await prisma.unit
    .create({
      data,
    })
    .then((response) => {
      res.status(200).json(response)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default handler
