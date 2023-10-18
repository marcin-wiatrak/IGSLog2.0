import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelectors, ordersActions, ordersSelectors, returnsActions, returnsSelectors } from '@src/store'
import { useEffect, useState } from 'react'
import { Paths } from '@src/types'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'
import { DatePicker } from '@mui/x-date-pickers'

type PickupAtModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onClearDate: () => void
}

export const PickupAtModal = ({ isOpen, onClose, onConfirm, onClearDate }: PickupAtModalProps) => {
  const dispatch = useDispatch()
  const { pickupAt } = useSelector(ordersSelectors.selectOrderDetails)
  const { returnAt } = useSelector(returnsSelectors.selectReturnDetails)
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const [isEdit, setIsEdit] = useState(false)

  const isOrder = currentPath === Paths.ORDERS
  // const localization = isOrder ? orderLocalization : returnLocalization

  useEffect(() => {
    setIsEdit(!!pickupAt)
  }, [])

  const handleDateChange = (date) => {
    isOrder
      ? dispatch(ordersActions.setOrderDetails({ pickupAt: date }))
      : dispatch(returnsActions.setReturnDetails({ returnAt: date }))
  }

  const date = pickupAt || returnAt

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Edytuj' : 'Ustal'} datę {isOrder ? 'odbioru' : 'zwrotu'}
      </DialogTitle>
      <DialogContent>
        <DatePicker
          value={date ? dayjs(date) : null}
          onChange={(date) => handleDateChange(dayjs(date).format())}
          label={`Data ${isOrder ? 'odbioru' : 'zwrotu'}`}
          format={DateTemplate.DDMMYYYY}
          sx={{ mt: 2 }}
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
          <Stack direction="row" spacing={1}>
            <Button
              color="error"
              variant="contained"
              onClick={onClearDate}
            >
              Usuń datę
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
            >
              Zapisz
            </Button>
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
