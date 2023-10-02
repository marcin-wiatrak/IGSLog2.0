import { TabPanel } from '@components/TabPanel'
import { Box, Chip, Tab, Tabs } from '@mui/material'
import { useMemo, useState } from 'react'
import { useGetUsersList } from '@src/hooks'
import { SummaryContent } from '../SummaryContent'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import dayjs from 'dayjs'

export const UserSummarizedTab = ({ index, value }) => {
  const { usersList } = useGetUsersList()
  const [tab, setTab] = useState(0)

  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const calendarData = useSelector(commonSelectors.selectCalendarData)

  const ordersForSelectedDay = useMemo(
    () => ({
      orders:
        calendarData?.orders.filter((el) => (el.pickupAt ? dayjs(el.pickupAt).isSame(selectedDay, 'day') : false)) ||
        [],
      returns:
        calendarData?.returns.filter((el) => (el.returnAt ? dayjs(el.returnAt).isSame(selectedDay, 'day') : false)) ||
        [],
    }),
    [calendarData, selectedDay]
  )

  const filteredUsersByOrders = useMemo(() => {
    return ordersForSelectedDay
      ? usersList.reduce((acc, item) => {
          const ordersLength = ordersForSelectedDay.orders.filter((el) => el.handleById === item.id).length
          const returnsLength = ordersForSelectedDay.returns.filter((el) => el.handleById === item.id).length
          if (!ordersLength && !returnsLength) return acc
          return [...acc, { ...item, ordersLength, returnsLength }]
        }, [])
      : []
  }, [ordersForSelectedDay, usersList])

  const tabLabel = (user) => {
    return (
      <>
        <span>
          {user.firstName} {user.lastName}
        </span>
        <Box>
          {!!user.ordersLength && (
            <Chip
              label={user.ordersLength}
              size="small"
              sx={{ ml: 1 }}
              color="success"
            />
          )}
          {!!user.returnsLength && (
            <Chip
              label={user.returnsLength}
              size="small"
              sx={{ ml: 1 }}
              color="warning"
            />
          )}
        </Box>
      </>
    )
  }

  return (
    <TabPanel
      index={index}
      value={value}
    >
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, tab) => setTab(tab)}
          orientation="vertical"
          variant="scrollable"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {filteredUsersByOrders.length ? (
            filteredUsersByOrders.map((user) => (
              <Tab
                label={tabLabel(user)}
                key={user.id}
              />
            ))
          ) : (
            <Tab
              label={'Brak wyników'}
              disabled
            />
          )}
        </Tabs>
        {filteredUsersByOrders.map((user, index) => (
          <TabPanel
            index={index}
            value={tab}
            key={user.id}
            sx={{ width: '100%' }}
          >
            <Box sx={{ p: 2 }}>
              <SummaryContent userId={user.id} />
            </Box>
          </TabPanel>
        ))}
      </Box>
    </TabPanel>
  )
}
