import { Autocomplete, Box, Collapse, IconButton, Stack, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AutocompleteOptionType, ErrorMessages } from '@src/types'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTemplate } from '@src/utils'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { AddCircle } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { customersSelectors, ordersActions } from '@src/store'
import { NewCustomerForm } from '@components/Orders/NewOrderDrawer/parts'
import { useDisclose, useGetCustomersList } from '@src/hooks'

export interface IFormInput extends yup.InferType<typeof schema> {
  customer: AutocompleteOptionType
  signature: string
  pickupAt: string
  notes: string
}

const defaultValues = {
  customer: null,
  signature: '',
  pickupAt: '',
  notes: '',
}

const schema = yup.object({
  customer: yup.object().required(ErrorMessages.EMPTY),
  signature: yup.string().required(ErrorMessages.EMPTY),
  pickupAt: yup.string().optional(),
  notes: yup.string(),
})

export const NewOrderForm = forwardRef((_, ref) => {
  const dispatch = useDispatch()
  const buttonSubmitRef = useRef(null)
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema), defaultValues })
  const newCustomerForm = useDisclose()

  const { onRefreshCustomersList } = useGetCustomersList()

  const handleSelectCreatedCustomer = (payload) => {
    dispatch(ordersActions.setCreateOrder({ registeredById: payload }))
  }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log('onSubmit', data)
    const payload = { ...data, customerId: data.customer.id }
    delete payload.customer
    dispatch(ordersActions.setCreateOrder(payload))
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

  useEffect(() => {
    isSubmitSuccessful && reset(defaultValues)
  }, [isSubmitted, reset, isSubmitSuccessful])

  return (
    <>
      <form>
        <Stack spacing={2}>
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
                  <AddCircle sx={{ transform: `rotate(${newCustomerForm.isOpen ? '45deg' : '0'})` }} />
                </IconButton>
              </Box>
            )}
          />
          <Collapse
            orientation="vertical"
            in={newCustomerForm.isOpen}
            unmountOnExit
            mountOnEnter
          >
            <NewCustomerForm
              isOpen={newCustomerForm.isOpen}
              onClose={newCustomerForm.onClose}
              onCustomerSet={handleSelectCreatedCustomer}
              onRefreshCustomersList={onRefreshCustomersList}
            />
          </Collapse>
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
          type="submit"
          onClick={handleSubmit(onSubmit)}
          ref={buttonSubmitRef}
        ></button>
      </form>
    </>
  )
})
