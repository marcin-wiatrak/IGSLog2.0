import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog'
import { useSelector } from 'react-redux'
import { ordersSelectors, usersSelectors } from '@src/store'

type AssignUserModalProps = {
  isOpen: boolean
  onClose: () => void
  onAssignUser: (orderId: string, userId: string) => void
  onUnassignUser: (orderId: string) => void
}

export const AssignUserModal: FC<AssignUserModalProps> = ({ isOpen, onClose, onAssignUser, onUnassignUser }) => {
  const orderId = useSelector(ordersSelectors.selectCurrentOrderId)
  const usersLisRaw = useSelector(usersSelectors.selectUsersList)
  const [selectedUser, setSelectedUser] = useState<{ id: string; label: string }>(null)

  const usersList = useMemo(() => {
    return usersLisRaw.map((user) => ({ id: user.id, label: `${user.firstName} ${user.lastName}` }))
  }, [usersLisRaw])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Przypisz osobę odpowiedzialną</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={selectedUser}
          onChange={(_, newValue: { id: string; label: string }) => setSelectedUser(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={usersList}
          renderInput={(props) => (
            <TextField
              label="Osoba odpowiedzialna"
              sx={{ marginY: '10px' }}
              {...props}
            />
          )}
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
              sx={{ marginRight: 1 }}
              variant="contained"
              color="warning"
              onClick={() => onUnassignUser(orderId)}
            >
              Usuń przypisanie
            </Button>
            <Button
              variant="contained"
              onClick={() => onAssignUser(orderId, selectedUser.id)}
            >
              Przypisz
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
