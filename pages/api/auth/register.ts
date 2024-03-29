import { prisma } from '@server/db'
import bcrypt from 'bcrypt'

const handler = async (req, res) => {
  const { password } = req.body
  bcrypt.genSalt(1, (err, salt) => {
    bcrypt.hash(password, salt, (err, password) => {
      const post = prisma.user
        .create({
          data: { ...req.body, password },
        })
        .then(() => {
          res.status(201).json(post)
        })
    })
  })
}

export default handler
