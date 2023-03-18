import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { FC, ReactNode } from 'react'

type ConfirmationModalType = {
  title: string
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  children: ReactNode
  cancelText?: string
  confirmText?: string
}

export const ConfirmationModal: FC<ConfirmationModalType> = ({
  title,
  open,
  onCancel,
  onConfirm,
  children,
  cancelText = 'Anuluj',
  confirmText = 'Potwierdź',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
