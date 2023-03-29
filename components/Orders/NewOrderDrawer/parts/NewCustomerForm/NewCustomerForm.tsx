import { withSnackbar } from '@components/UI'
import { yupResolver } from '@hookform/resolvers/yup'
import { Close, PersonAdd } from '@mui/icons-material'
import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useGetCustomersList, useSnackbar } from '@src/hooks'
import { ErrorMessages } from '@src/types'
import axios from 'axios'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

type NewCustomerFormProps = {
  onDialogClose: () => void
  onCustomerSet: (payload: { id: string; label: string }) => void
}

const schema = yup
  .object({
    name: yup.string().required(ErrorMessages.EMPTY),
    address: yup.string().required(ErrorMessages.EMPTY),
    phoneNumber: yup.string(),
    contactName: yup.string(),
  })
  .required()

interface IFormInput extends yup.InferType<typeof schema> {
  name: string
  address: string
  phoneNumber?: string
  contactName?: string
}

const defaultValues = {
  name: '',
  address: '',
  phoneNumber: '',
  contactName: '',
}

export const NewCustomerForm = ({
  onCustomerSet,
  onDialogClose,
}: NewCustomerFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })
  const { showSnackbar, snackbarProps } = useSnackbar()
  const { onRefreshCustomersList } = useGetCustomersList()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await axios
      .post('/api/customer/create', {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
        contactName: data.contactName,
      })
      .then(async (response) => {
        const { id, name } = response.data
        await onRefreshCustomersList()
        onCustomerSet({ id, label: name })
        showSnackbar({
          message: 'Dodano',
          severity: 'success',
          autoHideDuration: 3500,
        })
        onDialogClose()
      })
      .catch((err) => {
        showSnackbar({
          message: 'Error',
          severity: 'error',
          autoHideDuration: 3500,
        })
      })
  }

  useEffect(() => {
    isSubmitSuccessful &&
      reset({ name: '', address: '', phoneNumber: '', contactName: '' })
  }, [isSubmitted, reset, isSubmitSuccessful])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={2}
          pt={3}
          pb={1}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nazwa zleceniodawcy"
                required
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Adres zleceniodawcy"
                required
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="contactName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Osoba do kontaktu"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Numer telefonu"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button
            variant="contained"
            color="success"
            type="submit"
          >
            <PersonAdd sx={{ mr: 1 }} />
            Dodaj zleceniodawcę
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => reset(defaultValues)}
          >
            <Close sx={{ mr: 1 }} />
            Wyczyść
          </Button>
        </Stack>
      </form>
      <withSnackbar {...snackbarProps} />
    </>
  )
}
