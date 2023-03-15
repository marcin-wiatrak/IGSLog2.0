import { NextPage } from 'next'
import { Button, Unstable_Grid2 as Grid, Stack, TextField, Typography, Paper, Container } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import Router from 'next/router'

const SignIn: NextPage = () => {
  const { status } = useSession()

  if (status === 'authenticated') Router.replace('/')

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSubmit = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  }

  return (
    <Container>
      <Grid
        container
        xs={12}
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          xs={12}
          sm={10}
          md={5}
        >
          <Paper
            sx={{ padding: 5 }}
            elevation={4}
          >
            <Stack spacing={3}>
              <Typography
                align="center"
                variant="h3"
                fontWeight="bold"
              >
                IGSLog Logowanie
              </Typography>
              <TextField
                variant="outlined"
                label="E-mail"
                name="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
              <TextField
                variant="outlined"
                label="Hasło"
                type="password"
                name="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Zaloguj
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SignIn
