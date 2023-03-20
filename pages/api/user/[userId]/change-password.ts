import { prisma } from '@server/db'
import bcrypt from 'bcrypt'

const handler = async (req, res) => {
  const { password } = req.body
  const { userId } = req.query

  await bcrypt.genSalt(1, (err, salt) => {
    bcrypt.hash(password, salt, async (err, password) => {
      await prisma.user
        .update({
          data: {
            password,
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
    })
  })
}

export default handler
