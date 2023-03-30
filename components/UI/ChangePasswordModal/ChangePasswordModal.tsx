import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { ErrorMessages } from '@src/types'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  password: yup.string().required(ErrorMessages.EMPTY),
  confirmPassword: yup
    .string()
    .required(ErrorMessages.EMPTY)
    .oneOf([yup.ref('password'), null], ErrorMessages.INVALID_CONFIRM_PASSWORD),
})

interface IFormInput extends yup.InferType<typeof schema> {
  password: string
  confirmPassword: string
}

type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const session = useSession()
  const userId = session?.data?.user?.userId

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { password: '', confirmPassword: '' } })

  const handleChangeUserPassword = async (id: string, password: string) => {
    axios
      .post(`/api/user/${id}/change-password`, { password })
      .then((res) => {
        onClose()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    isValid && handleChangeUserPassword(userId, data.password)
  }

  const handleChangePasswordIsVisible = () => setIsPasswordVisible((prevState) => !prevState)

  return (
    <>
      <Dialog
        onClose={onClose}
        open={isOpen}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Zmiana hasła</DialogTitle>
        <DialogContent>
          <Stack
            spacing={1}
            sx={{ mt: 1 }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Nowe hasło"
                  error={!!error}
                  helperText={error?.message}
                  type={isPasswordVisible ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={handleChangePasswordIsVisible}
                      >
                        <IconButton>{isPasswordVisible ? <VisibilityOff /> : <Visibility />}</IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Powtórz nowe hasło"
                  error={!!error}
                  helperText={error?.message}
                  type={isPasswordVisible ? 'text' : 'password'}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="error"
          >
            Anuluj
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Zmień hasło
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
