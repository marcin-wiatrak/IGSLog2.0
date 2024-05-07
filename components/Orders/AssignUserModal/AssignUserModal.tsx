import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  commonSelectors,
  ordersActions,
  ordersSelectors,
  returnsActions,
  returnsSelectors,
  usersSelectors,
} from '@src/store'
import { Paths } from '@src/types'
import { useGetUsersList } from '@src/hooks'

type AssignUserModalProps = {
  isOpen: boolean
  onClose: () => void
  onAssignUser: ({ selectedUser, selfAssign, returnContent }?: { selectedUser?: string; selfAssign?: boolean, returnContent?: string }) => void
  onUnassignUser: ({ selectedUser, selfAssign }?: { selectedUser?: string; selfAssign?: boolean }) => void
}

export const AssignUserModal: FC<AssignUserModalProps> = ({ isOpen, onClose, onAssignUser, onUnassignUser }) => {
  const dispatch = useDispatch()
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const { usersList: usersLisRaw } = useGetUsersList()
  const { handleById: orderHandleById } = useSelector(ordersSelectors.selectOrderDetails)
  const { handleById: returnHandleById, handleByMaterialId, content } = useSelector(returnsSelectors.selectReturnDetails)
  const [selectedUser, setSelectedUser] = useState<{ id: string; label: string }>(null)

  // const isOrder = currentPath === Paths.ORDERS
  // const handleById = isOrder ? orderHandleById : returnHandleById

  const usersList = useMemo(() => {
    return usersLisRaw.filter(user => !user.hidden).map((user) => ({ id: user.id, label: `${user.firstName} ${user.lastName}` }))
  }, [usersLisRaw])

  useEffect(() => {
    if (selectedUser?.id) {
      currentPath === Paths.ORDERS
        ? dispatch(ordersActions.setOrderDetails({ handleById: selectedUser.id }))
        : dispatch(returnsActions.setReturnDetails({ [content === 'DOC' ? 'handleById' : 'handleByMaterialId']: selectedUser.id }))
    }
  }, [selectedUser])

  useEffect(() => {
    if ((orderHandleById || returnHandleById || handleByMaterialId) && usersList) {
      const foundUser = usersList?.find((el) => el.id === orderHandleById || el.id === handleByMaterialId || el.id === returnHandleById)
      setSelectedUser(foundUser ? foundUser : null)
    }
  }, [returnHandleById, orderHandleById, handleByMaterialId, usersList])

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
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )
          }}
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
              onClick={() => onUnassignUser({ selectedUser: '' })}
            >
              Usuń przypisanie
            </Button>
            <Button
              variant="contained"
              onClick={() => onAssignUser({ selectedUser: selectedUser.id, returnContent: content })}
            >
              Przypisz
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
