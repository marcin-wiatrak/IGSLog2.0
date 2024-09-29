import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate, toggleValueInArray } from '@src/utils'
import { Customer, Return, User } from '@prisma/client'
import { AutocompleteOptionType, ErrorMessages, OrderType, Paths } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { formatFullName, translatedType } from '@src/utils/textFormatter'
import {
  useDisclose,
  useGetCustomersList,
  useGetOrdersList,
  useGetReturnsList,
  useGetUsersList,
  usePath,
} from '@src/hooks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers'
import { DeleteOrderConfirmationModal } from '@components/modals'
import { useSession } from 'next-auth/react'

type ReturnProps = Return & { handleBy: User; customer: Customer; registeredBy: User }

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
  customer: AutocompleteOptionType
  signature: string
  returnAt: string
  returnAtMaterial: string
  notes: string
  localization: string
  localizationMaterial: string
  handleBy: AutocompleteOptionType
  handleByMaterial: AutocompleteOptionType
  content: string
  type: OrderType[]
}

const defaultValues = {
  customer: null,
  signature: '',
  returnAt: '',
  returnAtMaterial: '',
  notes: '',
  localization: '',
  localizationMaterial: '',
  handleBy: null,
  handleByMaterial: null,
  content: '',
  type: [],
}

const schema = yup.object({
  customer: yup.object().required(ErrorMessages.EMPTY),
  signature: yup.string().required(ErrorMessages.EMPTY),
  returnAt: yup.string().nullable(),
  returnAtMaterial: yup.string().nullable(),
  localization: yup.string().optional(),
  localizationMaterial: yup.string().optional(),
  notes: yup.string().optional().nullable(),
  handleBy: yup.object().nullable(),
  handleByMaterial: yup.object().nullable(),
  content: yup.string().required(ErrorMessages.EMPTY),
})

const ReturnPreview = () => {
  const { data } = useSession()

  const router = useRouter()
  const { returnId } = router.query

  const { usersList } = useGetUsersList()
  const { customersList } = useGetCustomersList()

  const [returnData, setReturnData] = useState<ReturnProps | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [rows, setRows] = useState(3)

  const { refreshReturnsList } = useGetReturnsList()
  const { refreshCustomersList} = useGetCustomersList()
  const { refreshOrdersList } = useGetOrdersList()
  const refreshData = () => {
    refreshCustomersList()
    refreshOrdersList()
    refreshReturnsList()
  }

  const confirmationModal = useDisclose()

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { isDirty },
  } = useForm({ resolver: yupResolver(schema), defaultValues })

  const returnContent = getValues().content

  console.log(getValues().content, watch().content)

  const goBack = () => router.back()

  const handleDeleteOrder = () => {
    axios.post(`/api/return/${returnId}/delete`).then((res) => {
      confirmationModal.onClose()
      if (res.status === 200) {
        goBack()
      }
    })
  }

  const handleGetReturnDetails = useCallback(() => {
    if (returnId) {
      setLoadingData(true)
      axios
        .get(`/api/return/${returnId}`)
        .then((res) => {
          const data = res.data

          const handleBy = data.handleBy
            ? {
              id: data.handleById,
              label: `${data.handleBy.firstName} ${data.handleBy.lastName}`,
            }
            : undefined

          const handleByMaterial = data.handleByMaterial
            ? {
              id: data.handleByMaterialId,
              label: `${data.handleByMaterial.firstName} ${data.handleByMaterial.lastName}`,
            }
            : undefined

          const customer = {
            id: data.customerId,
            label: data.customer.name,
          }

          const payload = {
            customer,
            handleBy,
            handleByMaterial,
            signature: data.signature,
            returnAt: data.returnAt,
            returnAtMaterial: data.returnAtMaterial,
            notes: data.notes ?? "",
            localization: data.localization ?? "",
            localizationMaterial: data.localizationMaterial ?? "",
            content: data.content,
            type: data.type,
          }

          reset(payload)
          setReturnData(data)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingData(false))
    }
  }, [reset, returnId])

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

  const customersListOptions = useMemo(() => {
    if (customersList && customersList.length) {
      return customersList.map((customer) => ({
        id: customer.id,
        label: customer.name,
      }))
    } else {
      return []
    }
  }, [customersList])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const payload = {
      ...data,
      customerId: data.customer.id,
      handleById: data.handleBy?.id,
      handleByMaterialId: data.handleByMaterial?.id,
    }
    delete payload.customer
    delete payload.handleBy
    delete payload.handleByMaterial

    await axios
      .post(`/api/return/${returnId}/update`, payload)
      .then((res) => {
        if (res.status === 200) {
          refreshData()
          goBack()
        }
      })
      .catch((err) => {
        console.error('WYSTĄPIŁ BŁĄD', returnId, err)
      })
  }

  useEffect(() => {
    handleGetReturnDetails()
  }, [handleGetReturnDetails])

  useEffect(() => {
    const defaultRows = localStorage.getItem('defaultRows')
    setRows(defaultRows ? +defaultRows : 3)
  }, [])

  useEffect(() => {
    localStorage.setItem('defaultRows', rows.toString())
  }, [rows])

  usePath(Paths.ORDERS)

  if (loadingData) return <Loader />

  return (
    <>
      <Layout>
        <Typography variant="h1">Szczegóły zwrotu</Typography>
        <Grid
          xs={12}
          container
          sx={{
            my: 3,
          }}
        >
          {returnData ? (
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
                          <Typography>{returnData.no}</Typography>
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
                          <Typography>{dayjs(returnData.createdAt).format(DateTimeTemplate.DDMMYYYYHHmm)}</Typography>
                        </Stack>
                      </Grid>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Typ
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                          >
                            {[OrderType.BIOLOGY, OrderType.PHYSICOCHEMISTRY, OrderType.TOXYCOLOGY].map((el) => (
                              <Controller
                                key={el}
                                name="type"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Chip
                                    avatar={getTypeIcon(el)}
                                    label={translatedType[el]}
                                    variant={value.includes(el) ? 'filled' : 'outlined'}
                                    onClick={() => onChange(toggleValueInArray(value || [], el))}
                                  />
                                )}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Zarejestrowane przez
                          </Typography>
                          <Typography>{formatFullName(returnData.registeredBy)}</Typography>
                        </Stack>
                      </Grid>
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
                          <Autocomplete
                            {...rest}
                            value={value}
                            fullWidth
                            blurOnSelect
                            options={customersListOptions}
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
                            {!!error && (
                              <FormHelperText error>{error.message || 'Zawartość jest wymagana'}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                      {/*{(returnData.content === 'MAT' || returnData.content === 'MAT+DOC') && (*/}
                      {(returnContent === 'MAT' || returnContent === 'MAT+DOC') && (
                        <Stack
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}
                          spacing={2}
                        >
                          <Typography
                            variant="body1"
                            color="grey"
                          >
                            Materiał
                          </Typography>
                          <Controller
                            name="handleByMaterial"
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
                            name="localizationMaterial"
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
                            name="returnAtMaterial"
                            control={control}
                            render={({ field: { onChange, value, ...rest } }) => (
                              <DatePicker
                                {...rest}
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(dayjs(date).format())}
                                label="Data zwrotu"
                                format={DateTemplate.DDMMYYYY}
                              />
                            )}
                          />
                        </Stack>
                      )}
                      {(returnContent === 'DOC' || returnContent === 'MAT+DOC') && (
                        <Stack
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}
                          spacing={2}
                        >
                          <Typography
                            variant="body1"
                            color="grey"
                          >
                            Dokumentacja
                          </Typography>
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
                            name="returnAt"
                            control={control}
                            render={({ field: { onChange, value, ...rest } }) => (
                              <DatePicker
                                {...rest}
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(dayjs(date).format())}
                                label="Data zwrotu"
                                format={DateTemplate.DDMMYYYY}
                              />
                            )}
                          />
                        </Stack>
                      )}
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Informacje dodatkowe"
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
                              onClick={() => router.back()}
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
                          <Typography variant="h4">Usuń zlecenie</Typography>
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
            <Typography>Wystąpił błąd. Sprawdź ID zlecenia.</Typography>
          )}
        </Grid>
      </Layout>
      <DeleteOrderConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.onClose}
        onConfirm={handleDeleteOrder}
        data={returnData}
      />
    </>
  )
}

export default ReturnPreview
