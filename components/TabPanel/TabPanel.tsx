import { Box, BoxProps } from '@mui/material'
import { ReactElement } from 'react'

type TabPanelProps = {
  children?: ReactElement
  index: number | string
  value: number | string
  fullWidth?: boolean
} & BoxProps

export const TabPanel = ({ children, value, index, fullWidth = false, ...props }: TabPanelProps) => {
  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      // id={`simple-tabpanel-${index}`}
      // aria-labelledby={`simple-tab-${index}`}
      {...props}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  )
}
