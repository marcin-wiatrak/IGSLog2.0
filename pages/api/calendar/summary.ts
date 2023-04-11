import { prisma } from '@server/db'
import dayjs from 'dayjs'

const handler = async (req, res) => {
  const { date } = req.body

  const createdAt = {
    gte: dayjs(date).startOf('day').format(),
    lte: dayjs(date).endOf('day').format(),
  }

  const orders = await prisma.order
    .findMany({
      where: {
        createdAt,
      },
    })
    .then((res) => res.map((el) => ({ ...el, list: 'order' })))

  const returns = await prisma.return
    .findMany({
      where: {
        createdAt,
      },
    })
    .then((res) => res.map((el) => ({ ...el, list: 'return' })))

  const meetings = await prisma.meeting
    .findMany({
      where: {
        createdAt,
      },
    })
    .then((res) => res.map((el) => ({ ...el, list: 'meeting' })))

  const list = [...orders, ...returns, ...meetings].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  res.status(200).json({ message: 'ok', data: list })
}

export default handler
