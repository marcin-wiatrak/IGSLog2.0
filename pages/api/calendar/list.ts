import { prisma } from '@server/db'

const handler = async (req, res) => {
  const orders = await prisma.order
    .findMany({
      where: {
        deleted: false,
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        handleBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
    .then((res) => res)
    .catch((err) => console.log(err))

  const returns = await prisma.return
    .findMany({
      where: {
        deleted: false,
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        handleBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
    .then((res) => res)
    .catch((err) => console.log(err))

  if (orders && returns) {
    await prisma.$disconnect()
    res.status(200).json({ orders, returns })
  }
}

export default handler
