import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from '../../../nextauth'
import { prisma } from '@server/db'
import bcrypt from 'bcrypt'
import * as process from 'process'

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize: async (credentials, req) => {
        const { email: inputEmail, password: inputPassword } = credentials as { email: string; password: string }
        const data = await prisma.user
          .findUnique({
            where: {
              email: inputEmail,
            },
          })
          .finally(async () => {
            await prisma.$disconnect()
          })
        const login = bcrypt.compare(inputPassword, data.password).then((result) => {
          if (result) {
            return {
              id: data.id,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              role: data.role as Role,
            }
          } else {
            throw new Error('Invalid credentials')
          }
        })
        return login.then((res) => res)
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt(params) {
      if (params.user) {
        params.token.role = params.user.role
        params.token.userId = params.user.id
        params.token.firstName = params.user.firstName
        params.token.lastName = params.user.lastName
      }

      return params.token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.userId = token.userId
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
      }
      return session
    },
  },
}
export default NextAuth(authOptions)
