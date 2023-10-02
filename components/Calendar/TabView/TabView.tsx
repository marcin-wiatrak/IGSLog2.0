import { Paper, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { FullSummaryTab } from '@components/Calendar/TabView/FullSummaryTab'
import { UserSummarizedTab } from '@components/Calendar/TabView/UserSummarizedTab'

export const TabView = () => {
  const [tab, setTab] = useState(0)

  return (
    <Paper sx={{ p: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
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
