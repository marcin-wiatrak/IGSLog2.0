import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Router from 'next/router'

const Protected: NextPage = () => {
  const { status, data } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/auth/signin')
  }, [status])

  console.log(data.user.role)

  if (status === 'authenticated') {
    return <p>Protected page</p>
  }

  return <p>Loading.................</p>
}
export default Protected
