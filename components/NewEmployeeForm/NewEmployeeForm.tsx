import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { useGetUsersList } from '@src/hooks'
import { ErrorMessages } from '@src/types'
import axios from 'axios'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Role } from '@src/types'

const schema = yup
  .object({
    email: yup.string().email(ErrorMessages.INVALID_EMAIL).required(ErrorMessages.EMPTY),
    firstName: yup.string().required(ErrorMessages.EMPTY),
    lastName: yup.string().required(ErrorMessages.EMPTY),
    role: yup.string().required(ErrorMessages.EMPTY),
  })
  .required()

interface IFormInput extends yup.InferType<typeof schema> {
  email: string
  firstName: string
  lastName: string
  role: Role
}

export const NewEmployeeForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    },
  })
  const { refreshUsersList } = useGetUsersList()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await axios
      .post('/api/auth/register', {
        ...data,
        password: '1234',
      })
      .then((res) => {
        console.log(res)
        refreshUsersList()
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    isSubmitSuccessful && reset({ email: '', firstName: '', lastName: '', role: '' })
  }, [isSubmitted, reset, isSubmitSuccessful])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                size="small"
                label="Adres email"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                size="small"
                label="Imię"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                size="small"
                label="Nazwisko"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                size="small"
                error={!!error}
              >
                <InputLabel id="role-label">Rola</InputLabel>
                <Select
                  {...field}
                  labelId="role-label"
                  id="role"
                  label="Rola"
                >
                  <MenuItem value={Role.USER}>Użytkownik</MenuItem>
                  <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Button
            variant="contained"
            type="submit"
          >
            Zarejestruj
          </Button>
        </Stack>
      </form>
    </>
  )
}
