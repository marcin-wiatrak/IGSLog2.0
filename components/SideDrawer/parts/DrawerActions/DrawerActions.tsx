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
      {actionsList.map(({ label, ...props }, index, array) => (
        <Button
          key={label}
          sx={{ mr: index + 1 < array.length ? 3 : 0 }}
          {...props}
        >
          {label}
        </Button>
      ))}
    </Box>
  )
}
