import { prisma } from '@server/db'

const handler = async (req, res) => {
  const { customer, signature, pickupAt, notes, registeredBy, type } = req.body

  const isInvalid = !customer || !signature

  if (isInvalid) {
    res.status(400).json({ message: 'Wrong body format' })
  } else {
    await prisma.order
      .create({
        data: {
          customer,
          signature,
          pickupAt,
          notes,
          registeredBy,
          type,
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
