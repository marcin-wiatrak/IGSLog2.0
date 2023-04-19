import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors } from '@src/store'
import { useEffect } from 'react'
import { OrderContent } from '@components/Calendar/TabView/SummaryContent/OrderContent'
import { ReturnContent } from '@components/Calendar/TabView/SummaryContent/ReturnContent'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'

type SummaryContentProps = {
  userId: string
}

export const SummaryContent = ({ userId }: SummaryContentProps) => {
  const dispatch = useDispatch()
  const date = useSelector(commonSelectors.selectCalendarDay)
  const calendarSummaryData = useSelector(commonSelectors.selectCalendarSummaryData)
  const summaryData = useSelector(commonSelectors.selectCalendarDay)

  useEffect(() => {
    axios.post(`/api/calendar/${userId}/summary`, { date }).then((res) => {
      dispatch(commonActions.setCalendarSummaryData({ calendarSummaryData: res.data }))
    })
  }, [date, userId])

  if (!calendarSummaryData) return null

  const { createdBy: orders, returnCreatedBy: returns, meetingAssignedTo: meetings } = calendarSummaryData

  const AccordionBox = ({ title, dataCount }) => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Typography
          sx={{ flex: 1 }}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography
          sx={{ flex: 1 }}
          color="text.secondary"
        >
          zlecenia: {dataCount}
        </Typography>
      </Box>
    </>
  )

  if (!orders?.length && !returns?.length && !meetings?.length) {
    return (
      <Typography
        color="text.secondary"
        textAlign="center"
      >
        Brak zleceń z dnia {dayjs(summaryData).locale('pl').format(DateTemplate.DDMMMMYYYY)}
      </Typography>
    )
  }

  return (
    <>
      {!!orders.length && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AccordionBox
              title="Odbiory"
              dataCount={orders.length}
            />
          </AccordionSummary>
          <AccordionDetails>
            {orders.map((orderData) => (
              <OrderContent
                orderData={orderData}
                key={orderData.id}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      {!!returns.length && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AccordionBox
              title="Zwroty"
              dataCount={returns.length}
            />
          </AccordionSummary>
          <AccordionDetails>
            {returns.map((returnData) => (
              <ReturnContent
                returnData={returnData}
                key={returnData.id}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      {!!meetings.length && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AccordionBox
              title="Spotkania"
              dataCount={meetings.length}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Zawartość</Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}
