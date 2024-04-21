import { NextPage } from 'next'
import { Fab, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout } from '@components/Layout'
import { FilterButtons } from '@components/FilterButtons/FilterButtons'
import { OrdersFiltersDrawer } from 'components/FiltersDrawer'
import { useDisclose, useGetCustomersList, useGetOrdersList, useGetUsersList, usePath } from '@src/hooks'
import { NewOrderDrawer, OrdersTable } from '@components/Orders'
import { Add } from '@mui/icons-material'
import { ordersActions, returnsActions } from '@src/store'
import { useDispatch } from 'react-redux'
import { withSnackbar } from '@components/HOC/WithSnackbar'
import { Paths } from '@src/types'
import { useEffect } from 'react'
import { MeetingsTable } from '@components/Meetings/MeetingsTable'
import { NewMeetingDrawer } from '@components/Meetings/NewMeetingDrawer'
import { meetingsActions } from '@src/store/meetings.slice'
import { MeetingsFiltersDrawer } from '@components/FiltersDrawer/MeetingsFiltersDrawer'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

const Meetings: NextPage = () => {
  const dispatch = useDispatch()
  const newMeetingDrawer = useDisclose()
  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDisclose()

  const handleClearFilters = () => dispatch(meetingsActions.clearFilters())

  return (
    <>
      <Layout>
        <Grid
          container
          xs={12}
          sx={{ width: '100%' }}
        >
          <Grid xs={12}>
            <Typography variant="h1">Spotkania</Typography>
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
                  disableTypes
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
              <MeetingsTable />
            </Grid>
          </Grid>
        </Grid>
      </Layout>
      <Fab
        variant="extended"
        color="primary"
        sx={fabStyle}
        onClick={newMeetingDrawer.onOpen}
      >
        <Add sx={{ mr: 1 }} />
        Nowe spotkanie
      </Fab>
      <NewMeetingDrawer
        isOpen={newMeetingDrawer.isOpen}
        onClose={newMeetingDrawer.onClose}
      />
      <MeetingsFiltersDrawer
        isOpen={isFilterDrawerOpen}
        onClose={onFilterDrawerClose}
      />
    </>
  )
}

export default withSnackbar(Meetings)
