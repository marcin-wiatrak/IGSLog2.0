import { Box, Drawer, DrawerProps } from '@mui/material'
import { DrawerActions, DrawerHeader } from '@components/SideDrawer/parts'
import { ReactNode } from 'react'
import { DrawerActionButton } from '@components/SideDrawer/parts/DrawerActions/DrawerActions'

type SideDrawerProps = {
  title: string
  children: ReactNode
  actionsList?: DrawerActionButton[]
  onClose: () => void
  width?: number
} & DrawerProps

export const SideDrawer = ({ title, children, actionsList, onClose, width = 350, ...props }: SideDrawerProps) => {
  return (
    <Drawer
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') onClose()
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'space-between',
          justifyContent: 'space-between',
          padding: 3,
          width: `${width}px`,
        }}
      >
        <DrawerHeader
          title={title}
          onClose={onClose}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'hidden',
            pb: 10,
          }}
        >
          {children}
        </Box>
        {actionsList && <DrawerActions actionsList={actionsList} />}
      </Box>
    </Drawer>
  )
}
