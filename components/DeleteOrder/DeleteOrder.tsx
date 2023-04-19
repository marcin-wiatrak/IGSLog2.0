import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { ConfirmationModal } from '@components/UI'
import { useDisclose } from '@src/hooks'
import axios from 'axios'

export const DeleteOrder = () => {
  const [mode, setMode] = useState('Order')
  const [orderId, setOrderId] = useState('')
  const confirmationModal = useDisclose()

  const handleModeChange = (val) => {
    setMode(val)
  }

  const handleDeleteOrder = useCallback(() => {
    if (mode === 'Order') {
      axios.post(`/api/order/${orderId}/delete`).then(() => confirmationModal.onClose())
    }
    if (mode === 'Meeting') {
      axios.post(`/api/meeting/${orderId}/delete`).then(() => confirmationModal.onClose())
    }
    if (mode === 'Return') {
      axios.post(`/api/return/${orderId}/delete`).then(() => confirmationModal.onClose())
    }
    setOrderId('')
  }, [orderId, mode])

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
      >
        <Select
          size="small"
          value={mode}
          onChange={({ target }) => handleModeChange(target.value)}
        >
          <MenuItem value="Order">Odbiór</MenuItem>
          <MenuItem value="Return">Zwrot</MenuItem>
          <MenuItem value="Meeting">Spotkanie</MenuItem>
        </Select>
        <TextField
          label="ID zlecenia"
          value={orderId}
          onChange={({ target }) => setOrderId(target.value)}
          size="small"
          fullWidth
        />
        <Button
          onClick={confirmationModal.onOpen}
          disabled={!orderId}
          variant="contained"
          color="error"
        >
          Usuń
        </Button>
      </Stack>
      <ConfirmationModal
        title={'Potwierdź usunięcie zlecenia'}
        open={confirmationModal.isOpen}
        onCancel={confirmationModal.onClose}
        onConfirm={handleDeleteOrder}
      >
        <Typography>Czy jesteś pewien, że chcesz usunąć to zlecenie?</Typography>
        <Typography color="error">Tej operacji nie da się cofnąć!</Typography>
      </ConfirmationModal>
    </>
  )
}
