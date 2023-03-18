import { Alert, AlertProps, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material'
import { FC } from 'react'

export type SnackbarType = {
  message: string
  severity: AlertProps['severity']
} & SnackbarProps

export const Snackbar: FC<SnackbarType> = ({ message, severity, ...props }) => {
  return (
    <MuiSnackbar {...props}>
      <Alert
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </MuiSnackbar>
  )
}
