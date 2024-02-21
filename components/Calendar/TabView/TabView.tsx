import { Paper, Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'
import { FullSummaryTab } from '@components/Calendar/TabView/FullSummaryTab'
import { UserSummarizedTab } from '@components/Calendar/TabView/UserSummarizedTab'

export const TabView = () => {
  const [tab, setTab] = useState(0)

  console.log(tab)

  const setLSTab = (newTab) => {
    localStorage.setItem('calendarTab', newTab)
  }

  useEffect(() => {
    const lsTab = localStorage.getItem('calendarTab')
    if (lsTab) setTab(parseInt(lsTab))
  }, [])

  return (
    <Paper sx={{ p: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, newTab) => {
          setTab(newTab)
          setLSTab(newTab)
        }}
        orientation="horizontal"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Zestawienie dzienne" />
        <Tab label="Wg pracownika" />
      </Tabs>
      <FullSummaryTab
        index={0}
        value={tab}
      />
      <UserSummarizedTab
        index={1}
        value={tab}
      />
    </Paper>
  )
}
