import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  const { password } = req.body
  bcrypt.genSalt(1, (err, salt) => {
    bcrypt.hash(password, salt, (err, password) => {
      const post = prisma.user
        .create({
          data: {
            email: req.body.email,
            password: password,
            firstName: 'Test',
            lastName: 'Testowy',
          },
        })
        .then(() => {
          res.status(201).json(post)
        })
    })
  })
}

export default handler
