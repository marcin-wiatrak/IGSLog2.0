import { Alert, Button, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { PersonAdd } from '@mui/icons-material'
import { useReducer, useState } from 'react'
import axios from 'axios'
import { Customer } from '@prisma/client'

type NewCustomerFormProps = {
  isOpen: boolean
  onClose: () => void
  onCustomerSet: (payload: { id: string; label: string }) => void
  onRefreshCustomersList: () => void
}

const customerReducer = (state = initialCustomerState, action) => {
  if (action.type === 'form') {
    return { ...state, [action.payload.field]: action.payload.value }
  }
  if (action.type === 'clearForm') {
    return initialCustomerState
  }
}

const initialCustomerState: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  address: '',
  phoneNumber: '',
  contactName: '',
}

export const NewCustomerForm = ({ isOpen, onClose, onCustomerSet, onRefreshCustomersList }: NewCustomerFormProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)
  const [customer, customerDispatch] = useReducer(customerReducer, initialCustomerState)

  const onSnackbarClose = () => setIsSnackbarOpen(false)
  const onSnackbarOpen = () => setIsSnackbarOpen(true)

  const handleFormChange = (field, value, method = 'form') =>
    customerDispatch({ type: method, payload: { field, value } })
  const handleCreateCustomer = async () => {
    await axios
      .post('/api/customer/create', {
        name: customer.name,
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        contactName: customer.contactName,
      })
      .then(async (response) => {
        const { id, name } = response.data
        await onRefreshCustomersList()
        onCustomerSet({ id, label: name })
        onClose()
      })
      .catch((err) => {
        onSnackbarOpen()
      })
  }

  return (
    <>
      <Paper
        sx={{
          padding: 3,
          width: '100%',
        }}
        elevation={3}
      >
        <Stack spacing={2}>
          <Typography variant="h5">Nowy zleceniodawca</Typography>
          <TextField
            label="Nazwa zleceniodawcy"
            value={customer.name}
            onChange={({ target }) => handleFormChange('name', target.value)}
            required
          />
          <TextField
            label="Adres zleceniodawcy"
            value={customer.address}
            onChange={({ target }) => handleFormChange('address', target.value)}
          />
          <TextField
            label="Osoba do kontaktu"
            value={customer.contactName}
            onChange={({ target }) => handleFormChange('contactName', target.value)}
          />
          <TextField
            label="Numer telefonu"
            value={customer.phoneNumber}
            onChange={({ target }) => handleFormChange('phoneNumber', target.value)}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleCreateCustomer}
          >
            <PersonAdd sx={{ mr: 1 }} />
            Dodaj zleceniodawcę
          </Button>
        </Stack>
      </Paper>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          variant="filled"
          onClose={onSnackbarClose}
          severity="error"
        >
          Alert
        </Alert>
      </Snackbar>
    </>
  )
}
