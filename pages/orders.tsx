import { NextPage } from 'next'
import { Fab, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout } from '@components/Layout'
import { FilterButtons } from '@components/Orders/FilterButtons/FilterButtons'
import { FiltersDrawer } from '@components/Orders/FiltersDrawer'
import { useDisclose, useGetCustomersList, useGetOrdersList, usePath } from '@src/hooks'
import { NewOrderDrawer, OrdersTable } from '@components/Orders'
import { Add } from '@mui/icons-material'
import { ordersActions } from '@src/store'
import { useDispatch } from 'react-redux'
import { withSnackbar } from '@components/HOC/WithSnackbar'
import { Paths } from '@src/types'
import { useEffect } from 'react'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

const Orders: NextPage = () => {
  const dispatch = useDispatch()
  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDisclose()
  const { isOpen: isNewOrderDrawerOpen, onOpen: onNewOrderDrawerOpen, onClose: onNewOrderDrawerClose } = useDisclose()

  const { refreshOrdersList } = useGetOrdersList()

  const { customersList, refreshCustomersList } = useGetCustomersList()

  const handleClearFilters = () => dispatch(ordersActions.resetFilters())

  usePath(Paths.ORDERS)

  useEffect(() => {
    refreshOrdersList()
  }, [])

  return (
    <>
      <Layout>
        <Grid
          container
          xs={12}
          sx={{ width: '100%' }}
        >
          <Grid xs={12}>
            <Typography variant="h1">Odbiory</Typography>
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
                <FilterButtons
                  onFilterDrawerOpen={onFilterDrawerOpen}
                  onClearFiltersClick={handleClearFilters}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ marginTop: 3 }}
            xs={12}
          >
            <Grid xs={12}>
              <OrdersTable />
            </Grid>
          </Grid>
        </Grid>
      </Layout>
      <Fab
        variant="extended"
        color="primary"
        sx={fabStyle}
        onClick={onNewOrderDrawerOpen}
      >
        <Add sx={{ mr: 1 }} />
        Nowy odbiór
      </Fab>
      <FiltersDrawer
        isOpen={isFilterDrawerOpen}
        onClose={onFilterDrawerClose}
      />
      <NewOrderDrawer
        isOpen={isNewOrderDrawerOpen}
        onClose={onNewOrderDrawerClose}
        customersList={customersList}
        onRefreshCustomersList={refreshCustomersList}
      />
    </>
  )
}

export default withSnackbar(Orders)
