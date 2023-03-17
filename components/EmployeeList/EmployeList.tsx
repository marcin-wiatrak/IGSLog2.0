import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal'
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
import { useGetUsersList } from '@src/hooks'
import { usersSelectors } from '@src/store'
import { Role } from '@src/types'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'

type UserDataType = {
  firstName: string
  lastName: string
  id: string
}

export const EmployeList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserDataType | null>(null)
  const { refreshUsersList } = useGetUsersList()
  const users = useSelector(usersSelectors.selectUsersList)

  const handleChangeUserRole = async (id: string, role: Role) => {
    axios
      .post(`/api/user/${id}/role`, { role })
      .then((res) => {
        console.log(res)
        refreshUsersList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleOpenModal = (firstName: string, lastName: string, id: string) => {
    setUserData({
      firstName,
      lastName,
      id,
    })
    setModalOpen(true)
  }

  const handleCloseModal = () => setModalOpen(false)

  const handleChangeUserPassword = async (id: string, password: string) => {
    console.log(id, password)
    axios
      .post(`/api/user/${id}/change-password`, { password })
      .then((res) => {
        console.log(res)
        handleCloseModal()
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
                      onChange={({ target }) => handleChangeUserRole(user.id, target.value as Role)}
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
                      handleOpenModal(user.firstName, user.lastName, user.id)
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
      {modalOpen && userData !== null && (
        <ConfirmationModal
          title={`Czy zresetować hasło użytownika ${userData.firstName} ${userData.lastName}?`}
          open={modalOpen}
          onCancel={handleCloseModal}
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
    </>
  )
}
