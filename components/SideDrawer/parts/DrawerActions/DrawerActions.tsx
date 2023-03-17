import { Box, Button, ButtonProps } from '@mui/material'

export type DrawerActionButton = {
  label: string
} & ButtonProps

type DrawerActionsProps = {
  actionsList: DrawerActionButton[]
}

export const DrawerActions = ({ actionsList }: DrawerActionsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {actionsList.map(({ label, ...props }) => (
        <Button
          {...props}
          key={label}
        >
          {label}
        </Button>
      ))}
    </Box>
  )
}
