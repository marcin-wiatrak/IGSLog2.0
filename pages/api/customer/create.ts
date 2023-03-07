import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  const { name, address, contactName, phoneNumber } = req.body

  const isInvalid = !name || !address

  if (isInvalid) {
    res.status(400).json({ message: 'Wrong body format' })
  } else {
    await prisma.customer
      .create({
        data: {
          name,
          address,
          phoneNumber,
          contactName,
        },
      })
      .then((response) => {
        res.status(200).json(response)
      })
      .finally(async () => {
        await prisma.$disconnect()
      })
  }
}

export default handler
