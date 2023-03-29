import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'
import { useEffect, useState } from 'react'

type LocalizationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const LocalizationModal = ({ isOpen, onClose, onConfirm }: LocalizationModalProps) => {
  const dispatch = useDispatch()
  const { localization } = useSelector(ordersSelectors.selectOrderDetails)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    setIsEdit(!!localization)
  }, [])

  const handleLocalizationChange = (localization) => dispatch(ordersActions.setOrderDetails({ localization }))

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{isEdit ? 'Edytuj' : 'Ustal'} miejsce odbioru</DialogTitle>
      <DialogContent>
        <TextField
          label="Miejsce odbioru"
          value={localization}
          onChange={({ target }) => handleLocalizationChange(target.value)}
          fullWidth
          sx={{ mt: 2 }}
          helperText={
            isEdit && !localization
              ? 'Miejsce odbioru zostanie usunięte'
              : '(Pozostaw puste, aby usunąć miejsce odbioru)'
          }
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="text"
            color="error"
            onClick={onClose}
          >
            Zamknij
          </Button>
          <Box>
            <Button
              variant="contained"
              onClick={onConfirm}
            >
              Zapisz
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
