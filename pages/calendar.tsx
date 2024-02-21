import { NextPage } from 'next'
import { Layout } from '@components/Layout'
import { Paper, Unstable_Grid2 as Grid } from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers'
import { TabView } from '@components/Calendar/TabView'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors } from '@src/store'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import axios from 'axios'

const Calendar: NextPage = () => {
  const dispatch = useDispatch()
  // const [highlightedDays, setHighlightedDays] = useState([1, 2, 15])
  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const selectedDate = dayjs(selectedDay)

  const handleChangeSelectedDay = (newDate) => {
    dispatch(commonActions.setCalendarDay({ calendarDay: dayjs(newDate).startOf('day').format() }))
    localStorage.setItem('employeeTab', '0')
  }

  const getData = async () => {
    await axios
      .get('/api/calendar/list')
      .then((res) => dispatch(commonActions.setCalendarData({ calendarData: res.data })))
  }

  useEffect(() => {
    getData()
  }, [])

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
            />
          </Paper>
        </Grid>
        <Grid
          xs={12}
          lg={8}
        >
          <TabView />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Calendar
