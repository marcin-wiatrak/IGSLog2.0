import { SnackbarType } from '@components/UI'
import { AlertProps, SnackbarProps } from '@mui/material'
import { useState } from 'react'
import { useDisclose } from '../useDisclose'

export const useSnackbar = () => {
  const { isOpen, onOpen, onClose } = useDisclose()
  const [snackbarProps, setSnackbarProps] = useState<SnackbarType>()

  const showSnackbar = ({
    message,
    severity,
    autoHideDuration = 5000,
  }: {
    message: string
    severity: AlertProps['severity']
    autoHideDuration?: SnackbarProps['autoHideDuration']
  }) => {
    setSnackbarProps({ message, severity, open: isOpen, onClose, autoHideDuration })
    onOpen()
  }

  return {
    showSnackbar,
    snackbarProps,
  }
}
