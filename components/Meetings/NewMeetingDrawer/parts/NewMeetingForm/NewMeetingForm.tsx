import { Autocomplete, Box, Button, Collapse, IconButton, Stack, TextField, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { DateTemplate } from '@src/utils'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { AutocompleteOptionType } from '@src/types'
import axios from 'axios'
import { useGetMeetingsList } from '@src/hooks/useGetMeetingsList'
import { useGetUnitsList } from '@src/hooks/useGetUnitsList/useGetUnitsList'
import { AddCircle, Close } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { usersSelectors } from '@src/store'

type NewMeetingFormProps = {
  onDrawerClose: () => void
}

interface IFormInput extends yup.InferType<typeof yupSchema> {
  unit: AutocompleteOptionType
  unitAgent: string
  date: string
  contact: string
  details: string
  notes: string
  handleBy: AutocompleteOptionType
}

const yupSchema = yup.object({
  unit: yup.object().required('error'),
  handleBy: yup.object().nullable(),
  unitAgent: yup.string().required('error'),
  date: yup.string().required('error'),
  contact: yup.string(),
  details: yup.string(),
  notes: yup.string(),
})

const defaultValues = {
  unit: null,
  unitAgent: '',
  handleBy: null,
  date: '',
  contact: '',
  details: '',
  notes: '',
}

export const NewMeetingForm = forwardRef<any, NewMeetingFormProps>((props, ref) => {
  const usersList = useSelector(usersSelectors.selectUsersList)
  const buttonSubmitRef = useRef(null)
  const { refreshMeetingsList } = useGetMeetingsList()
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(yupSchema), defaultValues })
  const { unitsList, refreshUnitsList } = useGetUnitsList()
  const [newUnitFormOpen, setNewUnitFormOpen] = useState(false)
  const [unitName, setUnitName] = useState('')

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const payload = {
      ...data,
      unitId: data.unit.id,
      handleById: data.handleBy?.id,
    }
    delete payload.unit
    delete payload.handleBy

    await axios
      .post('/api/meeting/create', payload)
      .then(() => {
        refreshMeetingsList()
        reset(defaultValues)
      })
      .catch((err) => console.log(err))
      .finally(() => props.onDrawerClose())
  }

  const unitsListOptions = useMemo(() => {
    if (unitsList) {
      return unitsList.map((unit) => ({
        id: unit.id,
        label: unit.name,
      }))
    }
  }, [unitsList])

  const usersListOption = useMemo(() => {
    if (usersList && usersList.length) {
      return usersList.map((user) => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }))
    }
  }, [usersList])

  useImperativeHandle(ref, () => ({
    submit() {
      buttonSubmitRef.current.click()
    },
    clearForm() {
      reset(defaultValues)
    },
  }))

  const handleAddNewUnit = async () => {
    await axios
      .post('/api/unit/create', { name: unitName.trim() })
      .then(async (res) => {
        await refreshUnitsList()
        const { id, name } = res.data
        setValue('unit', { id, label: name })
        setNewUnitFormOpen(false)
        setUnitName('')
      })
      .catch((err) => console.log(err))
  }

  return (
    <form>
      <Stack spacing={2}>
        <Controller
          name="unit"
          control={control}
          render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
            <Autocomplete
              {...rest}
              value={value}
              fullWidth
              blurOnSelect
              options={unitsListOptions || []}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Jednostka"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
        <Button
          startIcon={<AddCircle />}
          onClick={() => setNewUnitFormOpen(true)}
        >
          Dodaj jednostkę
        </Button>
        <Collapse in={newUnitFormOpen}>
          <Stack
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}
            spacing={2}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Nowa jednostka</Typography>
              <IconButton
                size="small"
                onClick={() => setNewUnitFormOpen(false)}
              >
                <Close />
              </IconButton>
            </Stack>
            <TextField
              label="Nazwa jednostki"
              fullWidth
              value={unitName}
              onChange={({ target }) => setUnitName(target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              size="large"
              onClick={handleAddNewUnit}
            >
              Dodaj
            </Button>
          </Stack>
        </Collapse>
        <Controller
          control={control}
          name="unitAgent"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Przedstawiciel jednostki"
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
          name="date"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <DatePicker
              {...rest}
              value={dayjs(value)}
              onChange={(date) => onChange(dayjs(date).format())}
              label="Data spotkania"
              format={DateTemplate.DDMMYYYY}
            />
          )}
        />
        <Controller
          control={control}
          name="contact"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Dane kontaktowe"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="details"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Ustalenia"
              error={!!error}
              helperText={error?.message}
              multiline
              rows={8}
            />
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Informacje dodatkowe"
              error={!!error}
              helperText={error?.message}
              multiline
              rows={2}
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
  )
})
