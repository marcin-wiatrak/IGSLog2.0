export enum Role {
  user = 'USER',
  admin = 'ADMIN',
}

declare module 'next-auth' {
  interface User {
    role?: Role
    userId?: string
    firstName: string
    lastName: string
  }
  interface Session extends DefaultSession {
    user?: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role
    userId?: strring
    firstName: string
    lastName: string
  }
}
