import { NextPage } from 'next'
import { Fab, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout } from '@components/Layout'
import { useState } from 'react'
import { FilterButtons } from '@components/Orders/FilterButtons/FilterButtons'
import { OrderType } from '@src/types'
import { FiltersDrawer } from '@components/Orders/FiltersDrawer'
import { useDrawer, useGetCustomersList, useGetOrdersList } from '@src/hooks'
import { NewOrderDrawer, Table } from '@components/Orders'
import { Add } from '@mui/icons-material'
import { useSession } from 'next-auth/react'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

const Orders: NextPage = () => {
  const session = useSession()
  console.log(session)
  const [selectedTypes, setSelectedTypes] = useState([])

  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDrawer()
  const { isOpen: isNewOrderDrawerOpen, onOpen: onNewOrderDrawerOpen, onClose: onNewOrderDrawerClose } = useDrawer()

  const { ordersList } = useGetOrdersList()
  const { customersList, onRefreshCustomersList } = useGetCustomersList()

  const handleClearFilters = () => {}

  const handleUpdateSelectedTypes = (type: OrderType) => {
    setSelectedTypes((prevList) => {
      if (prevList.includes(type)) {
        return prevList.filter((item) => item !== type)
      } else {
        return [...prevList, type]
      }
    })
  }

  const filterOrders = (orders) =>
    orders.filter((order) => {
      return selectedTypes.length ? selectedTypes.includes(order.type) : true
    })

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
                  onTypeClick={handleUpdateSelectedTypes}
                  selectedTypes={selectedTypes}
                  onFilterDrawerOpen={onFilterDrawerClose}
                  onClearFiltersClick={handleClearFilters}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ marginTop: 3 }}
          >
            <Grid>
              <Table
                data={ordersList}
                customersList={customersList}
              />
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
