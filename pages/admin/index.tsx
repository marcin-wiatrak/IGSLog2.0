import React from 'react'
import { Button, Unstable_Grid2 as Grid, Typography, Paper, TextField } from '@mui/material'
import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { Layout } from '@components/Layout'

const Admin: NextPage = () => {
  return (
    <Layout>
      <Grid
        container
        padding={2}
      >
        <Grid xs={12}>
          <Typography
            variant="h3"
            fontWeight="bold"
          >
            Panel administratora
          </Typography>
        </Grid>
        <Grid
          xs={12}
          md={6}
          lg={3}
        >
          <Paper sx={{ padding: '8px' }}>
            <Typography>Rejestracja pracownika</Typography>
            <TextField />
          </Paper>
        </Grid>
        <Button onClick={() => signIn()}> Zaloguj</Button>
      </Grid>
    </Layout>
  )
}

export default Admin
