import { NextPage } from 'next'
import { Fab, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout } from '@components/Layout'
import { FiltersDrawer } from '@components/Orders/FiltersDrawer'
import { useDisclose, useGetCustomersList, useGetUsersList, usePath } from '@src/hooks'
import { NewReturnDrawer, Table } from '@components/Returns'
import { Add } from '@mui/icons-material'
import { ordersActions } from '@src/store'
import { useDispatch } from 'react-redux'
import { withSnackbar } from '@components/HOC/WithSnackbar'
import { Paths } from '@src/types'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

const Returns: NextPage = () => {
  const dispatch = useDispatch()
  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDisclose()
  const {
    isOpen: isNewReturnDrawerOpen,
    onOpen: onNewReturnDrawerOpen,
    onClose: onNewReturnDrawerClose,
  } = useDisclose()

  const { usersList } = useGetUsersList()
  const { customersList, onRefreshCustomersList } = useGetCustomersList()

  const handleClearFilters = () => dispatch(ordersActions.resetFilters())

  usePath(Paths.RETURNS)

  return (
    <>
      <Layout>
        <Grid
          container
          xs={12}
          sx={{ width: '100%' }}
        >
          <Grid xs={12}>
            <Typography variant="h1">Zwroty</Typography>
            <Grid
              container
              xs={12}
            >
              <Grid
                xs={12}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { sm: 'center' },
                }}
              >
                {/*<FilterButtons*/}
                {/*  onFilterDrawerOpen={onFilterDrawerOpen}*/}
                {/*  onClearFiltersClick={handleClearFilters}*/}
                {/*/>*/}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ marginTop: 3 }}
            xs={12}
          >
            <Grid xs={12}>
              <Table />
            </Grid>
          </Grid>
        </Grid>
      </Layout>
      <Fab
        variant="extended"
        color="primary"
        sx={fabStyle}
        onClick={onNewReturnDrawerOpen}
      >
        <Add sx={{ mr: 1 }} />
        Nowy zwrot
      </Fab>
      <FiltersDrawer
        isOpen={isFilterDrawerOpen}
        onClose={onFilterDrawerClose}
      />
      <NewReturnDrawer
        isOpen={isNewReturnDrawerOpen}
        onClose={onNewReturnDrawerClose}
      />
    </>
  )
}

export default withSnackbar(Returns)
