import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors, returnsActions } from '@src/store'
import { useEffect, useState } from 'react'

type LocalizationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  source?: 'order' | 'return'
}

export const LocalizationModal = ({ isOpen, onClose, onConfirm, source }: LocalizationModalProps) => {
  const dispatch = useDispatch()
  const { localization: orderLocalization } = useSelector(ordersSelectors.selectOrderDetails)
  const { localization: returnLocalization } = useSelector(ordersSelectors.selectOrderDetails)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const isOrder = source === 'order'
  const localization = isOrder ? orderLocalization : returnLocalization

  useEffect(() => {
    setIsEdit(!!localization)
  }, [])

  const handleLocalizationChange = (localization) => {
    isOrder
      ? dispatch(ordersActions.setOrderDetails({ localization }))
      : dispatch(returnsActions.setReturnDetails({ localization }))
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Edytuj' : 'Ustal'} miejsce {isOrder ? 'odbioru' : 'zwrotu'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={`Miejsce ${isOrder ? 'odbioru' : 'zwrotu'}`}
          value={localization}
          onChange={({ target }) => handleLocalizationChange(target.value)}
          fullWidth
          sx={{ mt: 2 }}
          helperText={
            isEdit && !localization
              ? `Miejsce ${isOrder ? 'odbioru' : 'zwrotu'} zostanie usunięte`
              : `(Pozostaw puste, aby usunąć miejsce ${isOrder ? 'odbioru' : 'zwrotu'})`
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
