import { ConfirmationModal } from '@components/UI'
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useDisclose, useGetUsersList } from '@src/hooks'
import { Role } from '@src/types'
import axios from 'axios'
import { useState } from 'react'
import { Lock, LockOpen } from '@mui/icons-material'
import { SnackbarFunctionProps, withSnackbar } from '@components/HOC'

type UserDataType = {
  firstName: string
  lastName: string
  id: string
  currentRole?: Role
  newRole?: Role
}

type EmployeeListProps = {
  showSnackbar: (props: SnackbarFunctionProps) => void
}

const EmployeListComponent = ({ showSnackbar }: EmployeeListProps) => {
  const passwordResetConfirmationModal = useDisclose()
  const roleChangeConfirmationModal = useDisclose()
  const [userData, setUserData] = useState<UserDataType | null>(null)
  const { usersList: users, refreshUsersList } = useGetUsersList()

  const handleChangeUserRole = async (id: string, role: Role) => {
    axios
      .post(`/api/user/${id}/role`, { role })
      .then((res) => {
        if (res.statusText === 'OK') {
          showSnackbar({ message: 'Rola użytkownika została zmieniona', severity: 'success' })
        }
        refreshUsersList()
      })
      .catch((err) => {
        console.log(err)
      })
    roleChangeConfirmationModal.onClose()
  }

  const handlePasswordResetConfirmationModalOpen = (firstName: string, lastName: string, id: string) => {
    setUserData({
      firstName,
      lastName,
      id,
    })
    passwordResetConfirmationModal.onOpen()
  }

  const handleRoleChangeConfirmationModalOpen = (
    firstName: string,
    lastName: string,
    id: string,
    currentRole: Role,
    roleAfterTheChange: Role
  ) => {
    setUserData({
      firstName,
      lastName,
      id,
      currentRole,
      newRole: roleAfterTheChange,
    })
    roleChangeConfirmationModal.onOpen()
  }

  const onSuspend = (id: string, suspended: boolean) =>
    axios
      .post(`/api/user/${id}/suspend`, { suspended })
      .then((res) => {
        if (res.statusText === 'OK') {
          showSnackbar({
            message: `Konto użytkownika zostało ${suspended ? 'dezaktywowane' : 'aktywowane'}`,
            severity: 'success',
          })
        }
        refreshUsersList()
      })
      .catch((err) => console.log(err))

  const handleChangeUserPassword = async (id: string, password: string) => {
    axios
      .post(`/api/user/${id}/change-password`, { password })
      .then((res) => {
        passwordResetConfirmationModal.onClose()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Imię i nazwisko</TableCell>
            <TableCell align="left">Adres e-mail</TableCell>
            <TableCell align="left">Rola</TableCell>
            <TableCell align="left">Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell align="center">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    size="small"
                    defaultValue={user.role}
                    value={user.role}
                    id={user.id}
                    displayEmpty
                    sx={{ fontSize: '12px' }}
                    onChange={({ target }) =>
                      handleRoleChangeConfirmationModalOpen(
                        user.firstName,
                        user.lastName,
                        user.id,
                        user.role as Role,
                        target.value as Role
                      )
                    }
                  >
                    <MenuItem value={Role.USER}>{Role.USER}</MenuItem>
                    <MenuItem value={Role.ADMIN}>{Role.ADMIN}</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                <Stack
                  justifyContent="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handlePasswordResetConfirmationModalOpen(user.firstName, user.lastName, user.id)
                    }}
                  >
                    Zresetuj hasło
                  </Button>
                  {!user.suspended ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onSuspend(user.id, !user.suspended)}
                    >
                      <Lock />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => onSuspend(user.id, !user.suspended)}
                    >
                      <LockOpen />
                    </Button>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {passwordResetConfirmationModal.isOpen && userData !== null && (
        <ConfirmationModal
          title={`Czy zresetować hasło użytownika ${userData.firstName} ${userData.lastName}?`}
          open={passwordResetConfirmationModal.isOpen}
          onCancel={passwordResetConfirmationModal.onClose}
          onConfirm={() => handleChangeUserPassword(userData.id, '1234567')}
        >
          Potwierdzając zresetujesz hasło użytkownika{' '}
          <Typography
            component="span"
            sx={{ fontWeight: '700' }}
          >
            {userData.firstName} {userData.lastName}.
          </Typography>
          <br />
          Nowe hasło to:{' '}
          <Typography
            component="span"
            sx={{ fontWeight: '700' }}
          >
            1234567
          </Typography>
        </ConfirmationModal>
      )}
      {roleChangeConfirmationModal.isOpen && userData !== null && (
        <ConfirmationModal
          title={`Czy chcesz zmienić role użytkownika ${userData.firstName} ${userData.lastName}?`}
          open={roleChangeConfirmationModal.isOpen}
          onCancel={roleChangeConfirmationModal.onClose}
          onConfirm={() => handleChangeUserRole(userData.id, userData.newRole)}
        >
          Potwierdzając zmienisz role użytkownika{' '}
          <Typography
            component="span"
            sx={{ fontWeight: '700' }}
          >
            {userData.firstName} {userData.lastName}.
          </Typography>
          <br />
          Obecna rola:
          <Typography
            component="span"
            sx={{ fontWeight: '700' }}
          >
            {' '}
            {userData.currentRole}
          </Typography>
          <br />
          Rola po zmianie:
          <Typography
            component="span"
            sx={{ fontWeight: '700' }}
          >
            {' '}
            {userData.newRole}
          </Typography>
        </ConfirmationModal>
      )}
    </>
  )
}

export const EmployeList = withSnackbar(EmployeListComponent)
