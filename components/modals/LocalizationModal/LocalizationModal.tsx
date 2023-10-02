import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelectors, ordersActions, ordersSelectors, returnsActions, returnsSelectors } from '@src/store'
import { useEffect, useState } from 'react'
import { Paths } from '@src/types'

type LocalizationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const LocalizationModal = ({ isOpen, onClose, onConfirm }: LocalizationModalProps) => {
  const dispatch = useDispatch()
  const { localization: orderLocalization } = useSelector(ordersSelectors.selectOrderDetails)
  const { localization: returnLocalization } = useSelector(returnsSelectors.selectReturnDetails)
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const isOrder = currentPath === Paths.ORDERS
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
