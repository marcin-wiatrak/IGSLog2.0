import { NextPage } from 'next'
import { Paper, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { PrismaClient } from '@prisma/client'
import { Layout } from '@components/Layout'
import { useState } from 'react'
import { FilterButtons } from '@components/Orders/FilterButtons/FilterButtons'
import { OrderType } from '@src/types'
import { FiltersDrawer } from '@components/Orders/FiltersDrawer'
import { useDrawer } from '@src/hooks'
import { Table } from '@components/Orders'
import { Orders as OrdersProp } from '@prisma/client'

type OrdersProps = {
  orders: OrdersProp[]
}

const Orders: NextPage<OrdersProps> = ({ orders }) => {
  const [selectedTypes, setSelectedTypes] = useState([])

  const { isOpen, onOpen, onClose } = useDrawer()

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

  const ordersList = orders

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
                  onFilterDrawerOpen={onOpen}
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
              <Table data={ordersList} />
            </Grid>
            {/*{filterOrders(orders).map((order) => (*/}
            {/*  <Grid*/}
            {/*    xs={3}*/}
            {/*    key={order.id}*/}
            {/*  >*/}
            {/*    <Paper>*/}
            {/*      <Typography>{order.id}</Typography>*/}
            {/*      <Typography>{order.note}</Typography>*/}
            {/*      <Typography>{order.signature}</Typography>*/}
            {/*      <Typography>{order.status}</Typography>*/}
            {/*    </Paper>*/}
            {/*  </Grid>*/}
            {/*))}*/}
          </Grid>
        </Grid>
      </Layout>
      <FiltersDrawer
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default Orders

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

  const orders = await prisma.orders.findMany({
    orderBy: { id: 'desc' },
  })

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  }
}
