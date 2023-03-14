import { NextPage } from 'next'
import { Box, CircularProgress, Fab, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout } from '@components/Layout'
import { FilterButtons } from '@components/Orders/FilterButtons/FilterButtons'
import { FiltersDrawer } from '@components/Orders/FiltersDrawer'
import { useDrawer, useGetCustomersList, useGetOrdersList, useGetUsersList } from '@src/hooks'
import { NewOrderDrawer, Table } from '@components/Orders'
import { Add } from '@mui/icons-material'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

const Orders: NextPage = () => {
  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDrawer()
  const { isOpen: isNewOrderDrawerOpen, onOpen: onNewOrderDrawerOpen, onClose: onNewOrderDrawerClose } = useDrawer()

  const { ordersList } = useGetOrdersList()
  const { usersList } = useGetUsersList()
  const { customersList, onRefreshCustomersList } = useGetCustomersList()

  const handleClearFilters = () => {}

  return (
    <>
      <Layout>
        <Grid
          container
          xs={12}
          sx={{ width: '100%' }}
        >
          <Grid xs={12}>
            <Typography
              variant="h1"
              fontWeight="bolder"
            >
              Odbiory
            </Typography>
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
                  onFilterDrawerOpen={onFilterDrawerClose}
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
              <Table usersList={usersList} />
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
        onRefreshCustomersList={onRefreshCustomersList}
      />
    </>
  )
}

export default Orders
