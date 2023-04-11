import { NextPage } from 'next'
import { Layout } from '@components/Layout'
import { Paper, Unstable_Grid2 as Grid } from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers'
import { TabView } from '@components/Calendar/TabView'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors } from '@src/store'
import dayjs from 'dayjs'

const Calendar: NextPage = () => {
  const dispatch = useDispatch()
  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const selectedDate = dayjs(selectedDay)

  const handleChangeSelectedDay = (newDate) => {
    dispatch(commonActions.setCalendarDay({ calendarDay: dayjs(newDate).startOf('day').format() }))
  }

  return (
    <Layout>
      <Grid
        container
        xs={12}
        sx={{
          py: 2,
        }}
        columnSpacing={3}
      >
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Paper
            sx={{
              p: 2,
            }}
          >
            <DateCalendar
              value={selectedDate}
              onChange={handleChangeSelectedDay}
              disableFuture
            />
          </Paper>
        </Grid>
        <Grid
          xs={12}
          md={6}
          lg={8}
        >
          <TabView />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Calendar
