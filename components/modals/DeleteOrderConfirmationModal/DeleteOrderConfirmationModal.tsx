import { List, ListItem, Typography } from '@mui/material'
import { ConfirmationModal } from '@components/UI'
import { Order, Return } from '@prisma/client'
import { OrderExtended, ReturnExtended } from '@src/types'
import { grey } from '@mui/material/colors'

type DeleteOrderConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  data: OrderExtended | ReturnExtended
}

export const DeleteOrderConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
}: DeleteOrderConfirmationModalProps) => {
  return (
    <ConfirmationModal
      title={'Potwierdź usunięcie zlecenia'}
      open={isOpen}
      onCancel={onClose}
      onConfirm={onConfirm}
    >
      <List sx={{ fontWeight: 'bold' }}>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>LP:</Typography> <Typography>{data.no}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>Zleceniodawca:</Typography> <Typography>{data.customer.name}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>Sygnatura:</Typography> <Typography>{data.signature}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <Typography>Zarejestrowane przez:</Typography>{' '}
          <Typography>
            {data.registeredBy.firstName} {data.registeredBy.lastName}
          </Typography>
        </ListItem>
        <ListItem> {}</ListItem>
        <ListItem></ListItem>
      </List>
      <Typography>Czy jesteś pewien, że chcesz usunąć to zlecenie?</Typography>
      <Typography color="error">Tej operacji nie da się cofnąć!</Typography>
    </ConfirmationModal>
  )
}
