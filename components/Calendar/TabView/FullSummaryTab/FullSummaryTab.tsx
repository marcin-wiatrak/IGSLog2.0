import { TabPanel } from '@components/TabPanel'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import { ReturnContent } from '@components/Calendar/TabView/SummaryContent/ReturnContent'
import { OrderContent } from '@components/Calendar/TabView/SummaryContent/OrderContent'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'

export const FullSummaryTab = ({ index, value }) => {
  const selectedDay = useSelector(commonSelectors.selectCalendarDay)
  const [summaryList, setSummaryList] = useState(null)
  const getSummaryList = () => {
    selectedDay &&
      axios.post('/api/calendar/summary', { date: selectedDay }).then((res) => setSummaryList(res.data.data))
  }

  const renderSummaryContent = (element) => {
    switch (element.list) {
      case 'order':
        return <OrderContent orderData={element} />
      case 'return':
        return <ReturnContent returnData={element} />
    }
  }

  useEffect(() => {
    getSummaryList()
  }, [selectedDay])

  if (!summaryList) return null

  return (
    <TabPanel
      index={index}
      value={value}
      sx={{ pt: 3 }}
    >
      {summaryList.length ? (
        summaryList?.map((el) => renderSummaryContent(el))
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
