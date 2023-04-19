import { EmployeList } from '@components/EmployeeList'
import { Layout } from '@components/Layout'
import { NewEmployeeForm } from '@components/NewEmployeeForm'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { NextPage } from 'next'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DeleteOrder } from '@components/DeleteOrder'

const Admin: NextPage = () => {
  return (
    <Layout>
      <Grid
        container
        padding={2}
        spacing={2}
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
          lg={4}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Zarejestruj pracownika</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NewEmployeeForm />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Lista pracowników</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EmployeList />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Usuń zlecenie</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DeleteOrder />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Admin
