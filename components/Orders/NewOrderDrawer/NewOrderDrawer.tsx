import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FC, useEffect, useMemo, useReducer, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AddCircle, Check, Clear } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Customer, Order } from '@prisma/client'
import { NewCustomerForm } from './NewCustomerForm'

type NewOrderDrawerProps = {
  isOpen: boolean
  onClose: () => void
  customersList: Customer[]
  onRefreshCustomersList: () => void
}

type AutocompleteCustomer = {
  customer: {
    id: string
    label: string
  }
}

enum Types {
  BIOLOGY = 'BIOLOGY',
  TOXYCOLOGY = 'TOXYCOLOGY',
  PHYSICOCHEMISTRY = 'PHYSICOCHEMISTRY',
  FATHERHOOD = 'FATHERHOOD',
}

const formReducer = (state = initialFormState, action) => {
  const { value, field } = action.payload

  if (action.type === 'form') {
    return { ...state, [field]: value }
  }
  if (action.type === 'checkbox') {
    const typesArray = [...state.type]
    const newTypesArray = typesArray.includes(value)
      ? typesArray.filter((type) => type !== value)
      : [...typesArray, value]
    return { ...state, [field]: newTypesArray }
  }
  if (action.type === 'clearForm') {
    return initialFormState
  }
}

const initialFormState: Omit<Order, 'customer'> & AutocompleteCustomer = {
  customer: null,
  signature: '',
  pickupAt: null,
  localization: '',
  handleById: '',
  registeredBy: '',
  status: 'NEW',
  notes: '',
  type: [],
}

export const NewOrderDrawer: FC<NewOrderDrawerProps> = ({ isOpen, onClose, customersList, onRefreshCustomersList }) => {
  const [form, formDispatch] = useReducer(formReducer, initialFormState)
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState<boolean>(false)
  const session = useSession()

  const customersListOption = useMemo(() => {
    if (customersList && customersList.length) {
      return customersList.map((customer) => ({
        id: customer.id,
        label: customer.name,
      }))
    }
  }, [customersList])

  const handleFormClear = () => formDispatch({ type: 'clearForm' })
  const handleFormChange = (field, value, method = 'form') => formDispatch({ type: method, payload: { field, value } })

  const handleNewCustomerFormToggle = () => setIsCustomerFormOpen((prevState) => !prevState)
  const handleNewCustomerFormClose = () => setIsCustomerFormOpen(false)

  const handleSelectCreatedCustomer = (payload) => {
    formDispatch({ type: 'form', payload: { field: 'customer', value: payload } })
  }

  const handleSelectOrderType = (e) => {
    formDispatch({ type: 'checkbox', payload: { field: 'type', value: e.target.name } })
  }
  const IsTypeCheckboxChecked = (name) => {
    return form.type.includes(name)
  }

  useEffect(() => {
    if (!form.registeredById && session.data) {
      handleFormChange('registeredBy', session.data.user.userId)
    }
  }, [form.registeredById, session.data])

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      onClose={onClose}
      open={isOpen}
    >
      <Box
        sx={{
          paddingX: 3,
          paddingY: 5,
          minWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box>
          <Typography variant="h4">Utwórz zlecenie</Typography>
          <Stack spacing={3}>
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={IsTypeCheckboxChecked(Types.BIOLOGY)}
                      onChange={handleSelectOrderType}
                      name={Types.BIOLOGY}
                    />
                  }
                  label="Biologia"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={IsTypeCheckboxChecked(Types.TOXYCOLOGY)}
                      onChange={handleSelectOrderType}
                      name={Types.TOXYCOLOGY}
                    />
                  }
                  label="Toksykologia"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={IsTypeCheckboxChecked(Types.FATHERHOOD)}
                      onChange={handleSelectOrderType}
                      name={Types.FATHERHOOD}
                    />
                  }
                  label="Ustalanie ojcostwa"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={IsTypeCheckboxChecked(Types.PHYSICOCHEMISTRY)}
                      onChange={handleSelectOrderType}
                      name={Types.PHYSICOCHEMISTRY}
                    />
                  }
                  label="Fizykochemia"
                />
              </FormGroup>
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Autocomplete
                value={form.customer}
                fullWidth
                blurOnSelect
                options={customersListOption}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => handleFormChange('customer', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Zleceniodawca"
                  />
                )}
              />
              <IconButton
                size="large"
                color="primary"
                onClick={handleNewCustomerFormToggle}
              >
                <AddCircle sx={{ transform: `rotate(${isCustomerFormOpen ? '45deg' : '0'})` }} />
              </IconButton>
            </Box>
            <NewCustomerForm
              isOpen={isCustomerFormOpen}
              onClose={handleNewCustomerFormClose}
              onCustomerSet={handleSelectCreatedCustomer}
              onRefreshCustomersList={onRefreshCustomersList}
            />
            <TextField
              label="Sygnatura sprawy"
              value={form.signature}
              onChange={({ target }) => handleFormChange('signature', target.value)}
            />
            <DatePicker
              label="Data odbioru"
              value={dayjs(form.pickupAt)}
              onChange={(date) => handleFormChange('pickupAt', dayjs(date).format())}
            />
            <TextField
              label="Informacje dodatkowe"
              value={form.notes}
              multiline
              rows="3"
              onChange={({ target }) => handleFormChange('notes', target.value)}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            sx={{ mr: 3 }}
          >
            <Check sx={{ mr: 1 }} />
            Utwórz
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={handleFormClear}
          >
            <Clear sx={{ mr: 1 }} />
            Wyczyść
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
