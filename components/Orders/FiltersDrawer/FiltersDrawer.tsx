import { Autocomplete, Box, Drawer, TextField, Typography } from '@mui/material'
import { FC } from 'react'

type FiltersDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const FiltersDrawer: FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      onClose={onClose}
      open={isOpen}
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{ paddingX: 3 }}
      >
        <Typography>Filtry zleceń</Typography>
        {/*<Autocomplete renderInput={(params) => <TextField {...params} />} options={}*/}
      </Box>
    </Drawer>
  )
}
