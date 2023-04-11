import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        return token?.role === 'USER' || token?.role === 'ADMIN'
      },
    },
  }
)

export const config = { matcher: ['/orders', '/admin', '/returns', '/calendar'] }
