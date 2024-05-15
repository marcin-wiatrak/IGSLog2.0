import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Meeting, Unit, User } from '@prisma/client'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate } from '@src/utils'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetUsersList } from '@src/hooks'
import { DeleteMeetingConfirmationModal } from '@components/modals'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AutocompleteOptionType, ErrorMessages } from '@src/types'

type MeetingProps = Meeting & { unit: Unit; handleBy: User }

const Loader = () => (
  <Grid
    xs={12}
    container
  >
    <Grid
      xs={12}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Grid>
  </Grid>
)

export interface IFormInput extends yup.InferType<typeof schema> {
  notes: string
  handleBy: AutocompleteOptionType
  unitAgent: string
  contact: string
  details: string
}

const defaultValues = {
  notes: '',
  handleBy: null,
  unitAgent: '',
  contact: '',
  details: '',
}

const schema = yup.object({
  handleBy: yup.object().nullable(),
  unitAgent: yup.string().required(ErrorMessages.EMPTY),
  contact: yup.string().nullable(),
  details: yup.string().required(ErrorMessages.EMPTY),
  notes: yup.string().nullable(),
})

const MeetingPreview = () => {
  const { data } = useSession()
  const [loadingData, setLoadingData] = useState(true)
  const [meetingData, setMeetingData] = useState<MeetingProps | null>(null)
  const router = useRouter()
  const { meetingId } = router.query

  const [isUnlocked, setIsUnlocked] = useState(false)
  const confirmationModal = useDisclose()
  const [rows, setRows] = useState(3)
  const [rowsDetails, setRowsDetails] = useState(3)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
    getValues,
  } = useForm({ resolver: yupResolver(schema), defaultValues })

  const handleDeleteMeeting = () => {
    axios.post(`/api/meeting/${meetingId}/delete`).then((res) => {
      confirmationModal.onClose()
      if (res.status === 200) {
        router.back()
      }
    })
  }

  const { usersList } = useGetUsersList()

  const goBack = () => {
    router.back()
  }

  const usersListOption = useMemo(() => {
    if (usersList && usersList.length) {
      return usersList
        .filter((user) => !user.hidden)
        .map((user) => ({
          id: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }))
    } else {
      return []
    }
  }, [usersList])

  const handleGetMeetingDetails = useCallback(() => {
    if (meetingId) {
      setLoadingData(true)
      axios
        .get(`/api/meeting/${meetingId}`)
        .then((res) => {
          const data = res.data

          const handleBy = data.handleBy
            ? {
                id: data.handleById,
                label: `${data.handleBy.firstName} ${data.handleBy.lastName}`,
              }
            : undefined

          const payload = {
            handleBy,
            unitAgent: data.unitAgent,
            contact: data.contact,
            details: data.details,
            notes: data.notes,
          }

          reset(payload)
          setMeetingData(res.data)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingData(false))
    }
  }, [meetingId, reset])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const payload = {
      ...data,
      handleById: data.handleBy?.id,
    }
    delete payload.handleBy

    await axios
      .post(`/api/meeting/${meetingId}/update`, payload)
      .then((res) => {
        if (res.status === 200) goBack()
      })
      .catch((err) => {
        console.error('WYSTĄPIŁ BŁĄD', meetingId, err)
      })
  }

  useEffect(() => {
    handleGetMeetingDetails()
  }, [handleGetMeetingDetails])

  useEffect(() => {
    const defaultRows = localStorage.getItem('defaultRows')
    const defaultRowsDetails = localStorage.getItem('defaultRowsDetails')
    setRows(defaultRows ? +defaultRows : 3)
    setRowsDetails(defaultRowsDetails ? +defaultRowsDetails : 3)
  }, [])

  useEffect(() => {
    localStorage.setItem('defaultRows', rows.toString())
    localStorage.setItem('defaultRowsDetails', rowsDetails.toString())
  }, [rows, rowsDetails])

  return (
    <>
      <Layout>
        <Typography variant="h1">Szczegóły spotkania</Typography>
        <Grid
          xs={12}
          container
          sx={{
            my: 3,
          }}
        >
          {meetingData ? (
            <>
              <Grid xs />
              <Grid
                xs={12}
                sm={10}
                md={8}
                lg={6}
                xl={4}
              >
                <Stack spacing={3}>
                  <Paper
                    sx={{
                      p: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            LP
                          </Typography>
                          <Typography>{meetingData.no}</Typography>
                        </Stack>
                      </Grid>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Data utworzenia
                          </Typography>
                          <Typography>{dayjs(meetingData.createdAt).format(DateTimeTemplate.DDMMYYYYHHmm)}</Typography>
                        </Stack>
                      </Grid>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Data spotkania
                          </Typography>
                          <Typography>
                            {dayjs(meetingData.date).locale('pl').format(DateTemplate.DDMMMMYYYY)}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Jednostka:
                          </Typography>
                          <Typography>{meetingData.unit.name}</Typography>
                        </Stack>
                      </Grid>
                      <Controller
                        name="unitAgent"
                        control={control}
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
                                color="success"
                                helperText={error?.message}
                              />
                            )}
                          />
                        )}
                      />
                      <Controller
                        name="contact"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Kontakt"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                      <Controller
                        name="details"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Ustalenia"
                            multiline
                            rows={rowsDetails}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                      <Stack
                        direction="row"
                        sx={{ paddingBottom: 3 }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => setRowsDetails((prev) => prev + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => setRowsDetails((prev) => prev - 1)}
                        >
                          -
                        </Button>
                      </Stack>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Noatatki/informacje dodatkowe"
                            multiline
                            rows={rows}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                      <Stack direction="row">
                        <Button
                          variant="contained"
                          onClick={() => setRows((prev) => prev + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => setRows((prev) => prev - 1)}
                        >
                          -
                        </Button>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                      >
                        {isDirty ? (
                          <>
                            <Button
                              color="error"
                              onClick={goBack}
                            >
                              Wróć bez zapisywania
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleSubmit(onSubmit)}
                            >
                              Zapisz zmiany
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => router.back()}
                          >
                            Wróć
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                  {data?.user?.role === 'ADMIN' && (
                    <Paper
                      sx={{
                        p: 2,
                      }}
                    >
                      <Stack spacing={3}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h4">Usuń spotkanie</Typography>
                          <FormControlLabel
                            label="Odblokuj"
                            control={
                              <Checkbox
                                checked={isUnlocked}
                                onChange={({ target }) => setIsUnlocked(target.checked)}
                              />
                            }
                          />
                        </Stack>
                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          disabled={!isUnlocked}
                          onClick={confirmationModal.onOpen}
                        >
                          Usuń zlecenie
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Grid>
              <Grid xs />
            </>
          ) : (
            <Loader />
          )}
        </Grid>
      </Layout>
      <DeleteMeetingConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.onClose}
        onConfirm={handleDeleteMeeting}
        data={meetingData}
      />
    </>
  )
}

export default MeetingPreview
