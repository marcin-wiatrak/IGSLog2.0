import React, { useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/orders')
    }

    if (session.status === 'unauthenticated') {
      signIn()
    }
  }, [session])

  // if (session.status === 'loading') return null

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1">IGSLog</Typography>
      {/*<Button onClick={() => signIn()}>Zaloguj</Button>*/}
      {/*<Button onClick={() => signOut()}>Wyloguj</Button>*/}
      {/*<Button*/}
      {/*  component="a"*/}
      {/*  href="/orders"*/}
      {/*>*/}
      {/*  Odbiory*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  component="a"*/}
      {/*  href="/returns"*/}
      {/*>*/}
      {/*  Zwroty*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  component="a"*/}
      {/*  href="/meetings"*/}
      {/*>*/}
      {/*  Spotkania*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  component="a"*/}
      {/*  href="/meetings"*/}
      {/*>*/}
      {/*  Kalendarz*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  component="a"*/}
      {/*  href="/customers"*/}
      {/*>*/}
      {/*  Zleceniodawcy*/}
      {/*</Button>*/}
    </Box>
  )
}

export default Home
