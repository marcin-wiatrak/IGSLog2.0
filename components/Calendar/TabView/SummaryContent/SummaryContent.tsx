import { Box, IconButton, Tooltip, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import { useMemo } from 'react'
import { OrderContent } from '@components/Calendar/TabView/SummaryContent/OrderContent'
import { ReturnContent } from '@components/Calendar/TabView/SummaryContent/ReturnContent'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'
import { Summarize } from '@mui/icons-material'
import Link from 'next/link'

type SummaryContentProps = {
  userId: string
}

export const SummaryContent = ({ userId }: SummaryContentProps) => {
  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const calendarData = useSelector(commonSelectors.selectCalendarData)

  const filterOrdersForUser = useMemo(
    () => ({
      orders: calendarData.orders.filter((el) =>
        el.handleById === userId && el.pickupAt ? dayjs(el.pickupAt).isSame(selectedDay, 'day') : false
      ),
      returns: calendarData.returns.filter((el) =>
        el.handleById === userId && el.returnAt ? dayjs(el.returnAt).isSame(selectedDay, 'day') : false
      ),
    }),
    [calendarData, selectedDay, userId]
  )

  if (!filterOrdersForUser.orders.length && !filterOrdersForUser.returns.length) {
    return (
      <Typography
        color="text.secondary"
        textAlign="center"
      >
        Brak zleceń z dnia {dayjs(selectedDay).locale('pl').format(DateTemplate.DDMMMMYYYY)}
      </Typography>
    )
  }

  return (
    <>
      <Grid
        container
        xs={12}
        columnSpacing={3}
      >
        {!!filterOrdersForUser.orders.length && (
          <Grid xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
              <Typography
                variant="h6"
                align="center"
              >
                Odbiory
              </Typography>
              <Box sx={{ justifySelf: 'flex-end', marginLeft: 'auto' }}>
                <Link href={{ pathname: '/report', query: { data: JSON.stringify(filterOrdersForUser.orders), for: 'order' } }} as="/report" passHref>
                  <Tooltip
                    title="Pobierz raport"
                    arrow
                    enterDelay={200}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                    >
                      <Summarize />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Box>
            </Box>
            {filterOrdersForUser.orders.map((el) => (
              <OrderContent
                key={el.id}
                orderData={el}
              />
            ))}
          </Grid>
        )}
        {!!filterOrdersForUser.returns.length && (
          <Grid xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
              <Typography
                variant="h6"
                align="center"
              >
                Zwroty
              </Typography>
              <Box sx={{ justifySelf: 'flex-end', marginLeft: 'auto' }}>
                <Link href={{ pathname: '/report', query: { data: JSON.stringify(filterOrdersForUser.returns), for: 'return' } }} as="/report" passHref>
                  <Tooltip
                    title="Pobierz raport"
                    arrow
                    enterDelay={200}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                    >
                      <Summarize />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Box>
            </Box>
            {filterOrdersForUser.returns.map((el) => (
              <ReturnContent
                key={el.id}
                returnData={el}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </>
  )
}
