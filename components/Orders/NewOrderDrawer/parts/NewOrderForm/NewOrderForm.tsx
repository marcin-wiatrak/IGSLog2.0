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
import { useDisclose, useGetOrdersList, useSnackbar } from '@src/hooks'
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
  pickupAt: string
  notes: string
  localization: string
  type: OrderType[]
  handleBy: AutocompleteOptionType
}

const defaultValues = {
  customer: null,
  signature: '',
  pickupAt: '',
  notes: '',
  localization: '',
  type: [],
  handleBy: undefined,
}

const schema = yup.object({
  customer: yup.object().required(ErrorMessages.EMPTY),
  signature: yup.string().required(ErrorMessages.EMPTY),
  pickupAt: yup.string().optional(),
  localization: yup.string().optional(),
  notes: yup.string(),
  type: yup
    .array()
    .of(yup.string())
    .test('Min test', ErrorMessages.TYPE_MIN_LENGTH, (arr) => arr.length >= 1),
  handleBy: yup.object().optional(),
})

export const NewOrderForm = forwardRef<any, NewOrderFormProps>((props, ref) => {
  const { setLoading } = useLoading()
  const session = useSession()
  const dispatch = useDispatch()
  const newCustomerForm = useDisclose()
  const { showSnackbar } = useSnackbar()
  const { refreshOrdersList } = useGetOrdersList()
  const buttonSubmitRef = useRef(null)
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const usersList = useSelector(usersSelectors.selectUsersList)
  const attachment = useSelector(ordersSelectors.selectUploadedFiles)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
      pickupAt: data.pickupAt || undefined,
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
      .post('/api/order/create', payload)
      .then(() => {
        refreshOrdersList()
        dispatch(ordersActions.clearUploadedFiles())
        reset(defaultValues)
        showSnackbar({
          message: 'Pomyślnie utworzono zlecenie',
          severity: 'success',
        })
      })
      .catch((err) => {
        console.log(err)
        showSnackbar({
          message: 'Nie udało się utworzyć zlecenia. Spróbuj ponownie',
          severity: 'error',
        })
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
  }))

  const customersListOption = useMemo(() => {
    if (customersList && customersList.length) {
      return customersList.map((customer) => ({
        id: customer.id,
        label: customer.name,
      }))
    }
  }, [customersList])

  const usersListOption = useMemo(() => {
    if (usersList && usersList.length) {
      return usersList.map((user) => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }))
    }
  }, [usersList])

  return (
    <>
      <form>
        <Stack spacing={2}>
          <FormControl error={!!errors?.type}>
            <FormLabel component="legend">Typ odbioru</FormLabel>
            {[OrderType.BIOLOGY, OrderType.PHYSICOCHEMISTRY, OrderType.TOXYCOLOGY, OrderType.FATHERHOOD].map((el) => (
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
                label="Sygnatura sprawy"
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
                {customersListOption && !!customersListOption.length && (
                  <Autocomplete
                    {...rest}
                    value={value}
                    fullWidth
                    blurOnSelect
                    options={customersListOption}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, newValue) => onChange(newValue)}
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
            name="pickupAt"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <DatePicker
                {...rest}
                value={dayjs(value)}
                onChange={(date) => onChange(dayjs(date).format())}
                label="Data odbioru"
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
                label="Miejsce odbioru"
                error={!!error}
                helperText={error?.message}
              />
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
      {/*<Snackbar {...snackbarProps} />*/}
    </>
  )
})
