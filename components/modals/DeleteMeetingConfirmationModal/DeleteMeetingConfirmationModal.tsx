import { List, ListItem, Typography } from '@mui/material'
import { ConfirmationModal } from '@components/UI'
import { Order, Return } from '@prisma/client'
import { MeetingExtended, OrderExtended, ReturnExtended } from '@src/types'
import { grey } from '@mui/material/colors'

type DeleteMeetingConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  data: MeetingExtended
}

export const DeleteMeetingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
}: DeleteMeetingConfirmationModalProps) => {
  return (
    <ConfirmationModal
      title={'Potwierdź usunięcie Spotkania'}
      open={isOpen}
      onCancel={onClose}
      onConfirm={onConfirm}
    >
      <List sx={{ fontWeight: 'bold' }}>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>LP:</Typography> <Typography>{data?.no}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>Jednostka:</Typography> <Typography>{data?.unit.name}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between', borderBottom: 1, borderColor: grey[300] }}>
          <Typography>Przedstawiciel jednostki:</Typography> <Typography>{data?.unitAgent}</Typography>
        </ListItem>
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <Typography>Zarejestrowane przez:</Typography>{' '}
          <Typography>
            {data?.handleBy?.firstName} {data?.handleBy?.lastName}
          </Typography>
        </ListItem>
        <ListItem> {}</ListItem>
        <ListItem></ListItem>
      </List>
      <Typography>Czy jesteś pewien, że chcesz usunąć to spotkanie?</Typography>
      <Typography color="error">Tej operacji nie da się cofnąć!</Typography>
    </ConfirmationModal>
  )
}
