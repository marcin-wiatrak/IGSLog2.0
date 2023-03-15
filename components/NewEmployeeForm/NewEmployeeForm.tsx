import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { ErrorMessages } from '@src/types'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

const schema = yup
  .object({
    email: yup.string().email(ErrorMessages.INVALID_EMAIL).required(ErrorMessages.EMPTY),
    name: yup.string().required(ErrorMessages.EMPTY),
    surname: yup.string().required(ErrorMessages.EMPTY),
    role: yup.string().required(ErrorMessages.EMPTY),
  })
  .required()

interface IFormInput extends yup.InferType<typeof schema> {
  email: string
  name: string
  surname: string
  role: RoleEnum
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
      name: '',
      surname: '',
      role: '',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }

  useEffect(() => {
    isSubmitSuccessful && reset({ email: '', name: '', surname: '', role: '' })
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
            name="name"
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
            name="surname"
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
                  <MenuItem value={RoleEnum.USER}>Użytkownik</MenuItem>
                  <MenuItem value={RoleEnum.ADMIN}>Admin</MenuItem>
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
