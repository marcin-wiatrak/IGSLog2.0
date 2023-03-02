import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { NextPage } from 'next'
import { signIn, signOut } from 'next-auth/react'
import axios from 'axios'

const Home: NextPage = () => {
  const handleRegister = async () => {
    await axios.post('/api/auth/register', { email: 'm@m.pl', password: '12345' })
  }

  return (
    <Grid>
      <Typography>Test</Typography>
      <Button onClick={() => signIn()}>Zaloguj</Button>
      <Button onClick={handleRegister}>Rejestracja</Button>
      <Button onClick={() => signOut()}>Wyloguj</Button>
      <Button
        component="a"
        href="/orders"
      >
        Orders
      </Button>
    </Grid>
  )
}

export default Home
