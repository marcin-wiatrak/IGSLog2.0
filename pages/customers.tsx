import { NextPage } from 'next'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { Layout } from '@components/Layout'
import { Add, Check, Close } from '@mui/icons-material'
import { SnackbarFunctionProps, withSnackbar } from '@components/HOC/WithSnackbar'
import { NewCustomerForm } from '@components/Orders/NewOrderDrawer/parts'
import { useDisclose, useGetCustomersList } from '@src/hooks'
import { useState } from 'react'
import axios from 'axios'

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
}

type CustomersProps = {
  showSnackbar: (props: SnackbarFunctionProps) => void
}

const Customers: NextPage<CustomersProps> = ({ showSnackbar }) => {
  const [customerId, setCustomerId] = useState<string>(undefined)
  const [customerName, setCustomerName] = useState<string>(undefined)
  const [customerNameError, setCustomerNameError] = useState(false)
  const [customerAddress, setCustomerAddress] = useState<string>(undefined)
  const [customerAddressError, setCustomerAddressError] = useState(false)
  const [customerContact, setCustomerContact] = useState<string>(undefined)
  const [customerPhone, setCustomerPhone] = useState<string>(undefined)
  const [searchPhrase, setSearchPhrase] = useState<string>('')
  const newCustomerForm = useDisclose()
  const { customersList, refreshCustomersList } = useGetCustomersList()

  console.log('customerID', customerId)

  const handleEditCustomer = (customer) => {
    if (customerId !== undefined) cancelCustomerEdit()
    setCustomerId(customer.id)
    setCustomerName(customer.name)
    setCustomerAddress(customer.address)
    setCustomerContact(customer.contactName)
    setCustomerPhone(customer.phoneNumber)
  }

  const cancelCustomerEdit = () => {
    setCustomerId(undefined)
    setCustomerName(undefined)
    setCustomerAddress(undefined)
    setCustomerContact(undefined)
    setCustomerPhone(undefined)
  }

  const handleUpdateCustomer = async () => {
    if (!customerName || !customerAddress) {
      showSnackbar({ message: 'Popraw wymagane pola', severity: 'error' })
      setCustomerNameError(!customerName)
      setCustomerAddressError(!customerAddress)
      return
    }
    await axios
      .post('/api/customer/update', {
        id: customerId,
        name: customerName,
        address: customerAddress,
        contactName: customerContact,
        phoneNumber: customerPhone,
      })
      .then((res) => {
        console.log('res', res)
        if (res.status === 200) {
          cancelCustomerEdit()
          refreshCustomersList()
          showSnackbar({ message: 'Zleceniodawca zaktualizowany', severity: 'success' })
        }
      })
  }

  const filteredCustomer = (list) =>
    list.filter(
      (customer) =>
        (searchPhrase ? customer.name.toLowerCase().includes(searchPhrase.toLowerCase()) : true) ||
        (searchPhrase ? customer.address.toLowerCase().includes(searchPhrase.toLowerCase()) : true) ||
        (searchPhrase ? customer.contactName.toLowerCase().includes(searchPhrase.toLowerCase()) : true) ||
        (searchPhrase ? customer.phoneNumber.toLowerCase().includes(searchPhrase.toLowerCase()) : true)
    )

  if (!customersList) return null

  return (
    <>
      <Layout>
        <Grid
          container
          xs={12}
          sx={{ width: '100%' }}
        >
          <Grid xs={12}>
            <Stack
              spacing={3}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h1">Zleceniodawcy</Typography>
              <TextField
                label="Wyszukaj"
                value={searchPhrase}
                onChange={({ target }) => {
                  setSearchPhrase(target.value)
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setSearchPhrase('')}
                    >
                      <IconButton>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
          <Grid
            container
            sx={{ marginTop: 3, overflowY: 'auto', maxHeight: '100%' }}
            xs={12}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="30%">Nazwa</TableCell>
                  <TableCell width="30%">Adres</TableCell>
                  <TableCell width="15%">Osoba do kontaktu</TableCell>
                  <TableCell width="15%">Numer telefonu</TableCell>
                  <TableCell width="10%">Akcja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomer(customersList).map((customer) => (
                  <TableRow key={customer.id}>
                    {customerId === customer.id ? (
                      <>
                        <TableCell>
                          <TextField
                            fullWidth
                            label="Nazwa"
                            value={customerName}
                            onChange={({ target }) => {
                              setCustomerName(target.value)
                              setCustomerNameError(false)
                            }}
                            error={customerNameError}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            label="Adres"
                            value={customerAddress}
                            onChange={({ target }) => {
                              setCustomerAddress(target.value)
                              setCustomerAddressError(false)
                            }}
                            error={customerAddressError}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            label="Osoba do kontaktu"
                            value={customerContact}
                            onChange={({ target }) => setCustomerContact(target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            label="Numer telefonu"
                            value={customerPhone}
                            onChange={({ target }) => setCustomerPhone(target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack
                            justifyContent="center"
                            direction="row"
                            spacing={1}
                          >
                            <Button
                              color="error"
                              variant="contained"
                              onClick={cancelCustomerEdit}
                            >
                              <Close />
                            </Button>
                            <Button
                              color="success"
                              variant="contained"
                              onClick={handleUpdateCustomer}
                            >
                              <Check />
                            </Button>
                          </Stack>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.contactName}</TableCell>
                        <TableCell>{customer.phoneNumber}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditCustomer(customer)}>Edytuj</Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Layout>
      <Fab
        variant="extended"
        color="primary"
        sx={fabStyle}
        onClick={newCustomerForm.onOpen}
      >
        <Add sx={{ mr: 1 }} />
        Nowy zleceniodawca
      </Fab>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={newCustomerForm.isOpen}
        onClose={newCustomerForm.onClose}
      >
        <DialogTitle>Nowy zleceniodawca</DialogTitle>
        <DialogContent>
          <NewCustomerForm onDialogClose={newCustomerForm.onClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withSnackbar(Customers)
