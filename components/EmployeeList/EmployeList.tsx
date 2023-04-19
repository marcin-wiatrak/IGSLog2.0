import { ConfirmationModal } from '@components/UI'
import {
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useDisclose, useGetUsersList } from '@src/hooks'
import { usersSelectors } from '@src/store'
import { Role } from '@src/types'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'

type UserDataType = {
  firstName: string
  lastName: string
  id: string
  currentRole?: Role
  newRole?: Role
}

export const EmployeList = () => {
  const passwordResetConfirmationModal = useDisclose()
  const roleChangeConfirmationModal = useDisclose()
  const [userData, setUserData] = useState<UserDataType | null>(null)
  const { refreshUsersList } = useGetUsersList()
  const users = useSelector(usersSelectors.selectUsersList)

  const handleChangeUserRole = async (id: string, role: Role) => {
    axios
      .post(`/api/user/${id}/role`, { role })
      .then((res) => {
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
      <TableContainer component={Paper}>
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
                <TableCell
                  align="right"
                  sx={{ width: '120px' }}
                >
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
                <TableCell sx={{ width: '200px' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handlePasswordResetConfirmationModalOpen(user.firstName, user.lastName, user.id)
                    }}
                  >
                    Zresetuj hasło
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
