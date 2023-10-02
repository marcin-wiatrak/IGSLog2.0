import { TabPanel } from '@components/TabPanel'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import { ReturnContent } from '@components/Calendar/TabView/SummaryContent/ReturnContent'
import { OrderContent } from '@components/Calendar/TabView/SummaryContent/OrderContent'
import { Typography, Unstable_Grid2 as Grid } from '@mui/material'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'

export const FullSummaryTab = ({ index, value }) => {
  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const calendarData = useSelector(commonSelectors.selectCalendarData)

  if (!calendarData) return null

  const ordersForSelectedDay = {
    orders: calendarData.orders.filter((el) => (el.pickupAt ? dayjs(el.pickupAt).isSame(selectedDay, 'day') : false)),
    returns: calendarData.returns.filter((el) => (el.returnAt ? dayjs(el.returnAt).isSame(selectedDay, 'day') : false)),
  }

  return (
    <TabPanel
      index={index}
      value={value}
      sx={{ pt: 3 }}
    >
      {ordersForSelectedDay.orders.length || ordersForSelectedDay.returns.length ? (
        <Grid
          container
          xs={12}
          columnSpacing={3}
        >
          {!!ordersForSelectedDay.orders.length && (
            <Grid
              xs={12}
              lg={6}
            >
              <Typography
                variant="h6"
                align="center"
                marginBottom={3}
              >
                Odbiory
              </Typography>
              {ordersForSelectedDay.orders.map((el) => (
                <OrderContent
                  key={el.id}
                  orderData={el}
                />
              ))}
            </Grid>
          )}
          {!!ordersForSelectedDay.returns.length && (
            <Grid
              xs={12}
              lg={6}
            >
              <Typography
                variant="h6"
                align="center"
                marginBottom={3}
              >
                Zwroty
              </Typography>
              {ordersForSelectedDay.returns.map((el) => (
                <ReturnContent
                  key={el.id}
                  returnData={el}
                />
              ))}
            </Grid>
          )}
        </Grid>
      ) : (
        <Typography
          color="text.secondary"
          textAlign="center"
        >
          Brak zleceń z dnia {dayjs(selectedDay).locale('pl').format(DateTemplate.DDMMMMYYYY)}
        </Typography>
      )}
    </TabPanel>
  )
}
