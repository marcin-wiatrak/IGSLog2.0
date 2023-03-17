import { Box, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

type DrawerHeaderProps = {
  title: string
  onClose: () => void
}

export const DrawerHeader = ({ title, onClose }: DrawerHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
      }}
    >
      <Typography
        variant="h4"
        color="grey.600"
      >
        {title}
      </Typography>
      <IconButton onClick={onClose}>
        <Close />
      </IconButton>
    </Box>
  )
}
