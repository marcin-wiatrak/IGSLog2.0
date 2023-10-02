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
  const [formError, setFormError] = useState<string>('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (!response.ok) {
      setFormError(
        response.error === 'Invalid credentials' ? 'Nieprawidłowe dane logowania' : 'Wystąpił błąd logowania'
      )
    }
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
            <form onSubmit={handleSubmit}>
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
                  onChange={({ target }) => {
                    setFormError('')
                    setEmail(target.value)
                  }}
                  error={!!formError}
                />
                <TextField
                  variant="outlined"
                  label="Hasło"
                  type="password"
                  name="password"
                  value={password}
                  onChange={({ target }) => {
                    setFormError('')
                    setPassword(target.value)
                  }}
                  error={!!formError}
                />
                {!!formError && (
                  <Typography
                    color="red"
                    align="center"
                  >
                    {formError}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  type="submit"
                >
                  Zaloguj
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SignIn
