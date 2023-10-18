import {
  Autocomplete,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AutocompleteOptionType, ErrorMessages, OrderType } from '@src/types'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTemplate, toggleValueInArray } from '@src/utils'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { AddCircle } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { customersSelectors, ordersActions, ordersSelectors, usersSelectors } from '@src/store'
import { NewCustomerForm } from '@components/Orders/NewOrderDrawer/parts'
import { useDisclose, useGetReturnsList, useGetUsersList } from '@src/hooks'
import { translatedType } from '@src/utils/textFormatter'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useLoading } from '@src/hooks/useLoading/useLoading'

type NewOrderFormProps = {
  onDrawerClose: () => void
}

export interface IFormInput extends yup.InferType<typeof schema> {
  customer: AutocompleteOptionType
  signature: string
  returnAt: string
  notes: string
  localization: string
  type: OrderType[]
  handleBy: AutocompleteOptionType
  content: string
}

const defaultValues = {
  customer: null,
  signature: '',
  returnAt: '',
  notes: '',
  localization: '',
  type: [],
  handleBy: null,
  content: '',
}

const schema = yup.object({
  customer: yup.object().required(ErrorMessages.EMPTY),
  signature: yup.string().required(ErrorMessages.EMPTY),
  returnAt: yup.string().optional(),
  localization: yup.string().optional(),
  notes: yup.string().optional(),
  type: yup
    .array()
    .of(yup.string())
    .test('Min test', ErrorMessages.TYPE_MIN_LENGTH, (arr) => arr.length >= 1),
  handleBy: yup.object().nullable(),
  content: yup.string().required(ErrorMessages.EMPTY),
})

export const NewReturnForm = forwardRef<any, NewOrderFormProps>((props, ref) => {
  const { setLoading } = useLoading()
  const session = useSession()
  const dispatch = useDispatch()
  const newCustomerForm = useDisclose()
  const { refreshReturnsList } = useGetReturnsList()
  const buttonSubmitRef = useRef(null)
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const { usersList } = useGetUsersList()
  const attachment = useSelector(ordersSelectors.selectUploadedFiles)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues })

  const handleSelectCreatedCustomer = (payload) => {
    setValue('customer', payload)
    dispatch(ordersActions.setCreateOrder({ registeredById: payload }))
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading('newOrder', true)
    const payload = {
      ...data,
      returnAt: data.returnAt || undefined,
      notes: data.notes || undefined,
      localization: data.localization || undefined,
      customerId: data.customer.id,
      handleById: data.handleBy?.id,
      attachment: attachment ?? undefined,
      registeredById: session.data.user.userId,
    }
    delete payload.customer
    delete payload.handleBy

    await axios
      .post('/api/return/create', payload)
      .then(() => {
        refreshReturnsList()
        // dispatch(ordersActions.clearUploadedFiles())
        reset(defaultValues)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading('newOrder', false)
        props.onDrawerClose()
      })
  }

  useImperativeHandle(ref, () => ({
    submit() {
      buttonSubmitRef.current.click()
    },
    clearForm() {
      reset(defaultValues)
    },
  }))

  const customersListOption = useMemo(() => {
    if (customersList && customersList.length) {
      return customersList.map((customer) => ({
        id: customer.id,
        label: customer.name,
      }))
    } else {
      return []
    }
  }, [customersList])

  const usersListOption = useMemo(() => {
    if (usersList && usersList.length) {
      return usersList.filter(user => !user.hidden).filter(user => !user.hidden).map((user) => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }))
    } else {
      return []
    }
  }, [usersList])

  return (
    <>
      <form>
        <Stack spacing={2}>
          <FormControl error={!!errors?.type}>
            <FormLabel component="legend">Typ odbioru</FormLabel>
            {[OrderType.BIOLOGY, OrderType.PHYSICOCHEMISTRY, OrderType.TOXYCOLOGY].map((el) => (
              <FormControlLabel
                key={el}
                label={translatedType[el]}
                control={
                  <Controller
                    name="type"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value.includes(el)}
                        onChange={() => onChange(toggleValueInArray(value || [], el))}
                      />
                    )}
                  />
                }
              />
            ))}
            {!!errors?.type && <FormHelperText>{errors.type.message || 'Typ jest wymagany'}</FormHelperText>}
          </FormControl>
          <Controller
            name="signature"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Sygnatura"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="customer"
            control={control}
            render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {customersListOption && (
                  <Autocomplete
                    {...rest}
                    value={value}
                    fullWidth
                    blurOnSelect
                    options={customersListOption}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, newValue) => onChange(newValue)}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option.label}
                        </li>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Zleceniodawca"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
                <IconButton
                  size="large"
                  color={newCustomerForm.isOpen ? 'error' : 'primary'}
                  onClick={newCustomerForm.isOpen ? newCustomerForm.onClose : newCustomerForm.onOpen}
                >
                  <AddCircle
                    sx={{
                      transform: `rotate(${newCustomerForm.isOpen ? '45deg' : '0'})`,
                    }}
                  />
                </IconButton>
              </Box>
            )}
          />
          <Controller
            name="returnAt"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <DatePicker
                {...rest}
                value={dayjs(value)}
                onChange={(date) => onChange(dayjs(date).format())}
                label="Data zwrotu"
                format={DateTemplate.DDMMYYYY}
              />
            )}
          />
          <Controller
            name="localization"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Miejsce zwrotu"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <InputLabel component="legend">Zawartość</InputLabel>
                <Select
                  {...field}
                  label="Zawartość"
                  error={!!error}
                >
                  <MenuItem value="MAT">Materiał</MenuItem>
                  <MenuItem value="DOC">Dokumentacja</MenuItem>
                  <MenuItem value="MAT+DOC">Materiał + Dokumentacja</MenuItem>
                </Select>
                {!!error && <FormHelperText error>{error.message || 'Zawartość jest wymagana'}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="handleBy"
            control={control}
            render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
              <Autocomplete
                {...rest}
                value={value}
                fullWidth
                blurOnSelect
                options={usersListOption}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => onChange(newValue)}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.label}
                    </li>
                  )
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Osoba odpowiedzialna"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Informacje dodatkowe"
                multiline
                rows="3"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Stack>
        <button
          hidden
          type="submit"
          onClick={handleSubmit(onSubmit)}
          ref={buttonSubmitRef}
        ></button>
      </form>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={newCustomerForm.isOpen}
        onClose={newCustomerForm.onClose}
      >
        <DialogTitle>Nowy zleceniodawca</DialogTitle>
        <DialogContent>
          <NewCustomerForm
            onCustomerSet={handleSelectCreatedCustomer}
            onDialogClose={newCustomerForm.onClose}
          />
        </DialogContent>
      </Dialog>
    </>
  )
})
