import { Alert, AlertColor, AlertProps, Snackbar as MuiSnackbar, SnackbarProps } from '@mui/material'
import { useState } from 'react'

export type SnackbarFunctionProps = {
  message: string
  severity: AlertProps['severity']
  duration?: SnackbarProps['autoHideDuration']
}

export const withSnackbar = (WrappedComponent) => (props) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [duration, setDuration] = useState(3500)
  const [severity, setSeverity] = useState('success')
  const showSnackbar = ({ message, severity, duration = 3500 }: SnackbarFunctionProps) => {
    setMessage(message)
    setSeverity(severity)
    setDuration(duration)
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <WrappedComponent
        {...props}
        showSnackbar={showSnackbar}
      />
      <MuiSnackbar
        autoHideDuration={duration}
        open={open}
        onClose={handleClose}
      >
        <Alert
          severity={severity as AlertColor}
          variant="filled"
        >
          {message}
        </Alert>
      </MuiSnackbar>
    </>
  )
}
