import { TabPanel } from '@components/TabPanel'
import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { useGetUsersList } from '@src/hooks'
import { SummaryContent } from '../SummaryContent'

export const UserSummarizedTab = ({ index, value }) => {
  const { usersList } = useGetUsersList()
  const [tab, setTab] = useState(0)
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
          {usersList.map((user) => (
            <Tab
              label={`${user.firstName} ${user.lastName}`}
              key={user.id}
            />
          ))}
        </Tabs>
        {usersList.map((user, index) => (
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
