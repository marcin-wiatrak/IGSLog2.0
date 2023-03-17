import { Box, Drawer, DrawerProps } from '@mui/material'
import { DrawerActions, DrawerHeader } from '@components/SideDrawer/parts'
import { ReactNode } from 'react'
import { DrawerActionButton } from '@components/SideDrawer/parts/DrawerActions/DrawerActions'

type SideDrawerProps = {
  title: string
  children: ReactNode
  actionsList?: DrawerActionButton[]
  onClose: () => void
} & DrawerProps

export const SideDrawer = ({ title, children, actionsList, onClose, ...props }: SideDrawerProps) => {
  return (
    <Drawer
      onClose={onClose}
      {...props}
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{ padding: 3, height: '100%', width: '350px' }}
      >
        <DrawerHeader
          title={title}
          onClose={onClose}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          {children}
          {actionsList && <DrawerActions actionsList={actionsList} />}
        </Box>
      </Box>
    </Drawer>
  )
}
