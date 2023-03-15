import { Layout } from '@components/Layout'
import { NewEmployeeForm } from '@components/NewEmployeeForm'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { NextPage } from 'next'

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
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">Zarejestruj pracownika</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NewEmployeeForm />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Admin
