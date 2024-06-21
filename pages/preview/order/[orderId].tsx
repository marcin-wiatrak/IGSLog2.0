import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Link,
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
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate, renameDownloadFile, toggleValueInArray } from '@src/utils'
import { Customer, Order, User } from '@prisma/client'
import { AutocompleteOptionType, ErrorMessages, OrderType, Paths } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { formatFullName, translatedType } from '@src/utils/textFormatter'
import { useDisclose, useGetCustomersList, useGetUsersList, usePath } from '@src/hooks'
import { DeleteOrderConfirmationModal } from '@components/modals'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers'
import { useSession } from 'next-auth/react'

type OrderProps = Order & { handleBy: User; customer: Customer; registeredBy: User }

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
  pickupAt: string
  notes: string
  localization: string
  handleBy: AutocompleteOptionType
  type: OrderType[]
}

const defaultValues = {
  customer: null,
  signature: '',
  pickupAt: '',
  notes: '',
  localization: '',
  handleBy: null,
  type: [],
}

const schema = yup.object({
  customer: yup.object().required(ErrorMessages.EMPTY),
  signature: yup.string().required(ErrorMessages.EMPTY),
  pickupAt: yup.string().nullable(),
  localization: yup.string().optional().nullable(),
  notes: yup.string().optional().nullable(),
  handleBy: yup.object().nullable(),
})

const OrderPreview = () => {
  const { data } = useSession()

  const router = useRouter()
  const { orderId } = router.query

  const { usersList } = useGetUsersList()
  const { customersList } = useGetCustomersList()

  const [orderData, setOrderData] = useState<OrderProps | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [rows, setRows] = useState(3)

  const confirmationModal = useDisclose()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
    getValues
  } = useForm({ resolver: yupResolver(schema), defaultValues })

  const goBack = () => router.back()

  const handleDeleteOrder = () => {
    axios.post(`/api/order/${orderId}/delete`).then((res) => {
      confirmationModal.onClose()
      if (res.status === 200) {
        goBack()
      }
    })
  }

  const handleGetOrderDetails = useCallback(() => {
    if (orderId) {
      setLoadingData(true)
      axios
        .get(`/api/order/${orderId}`)
        .then((res) => {
          const data = res.data

          const handleBy = data.handleBy
            ? {
                id: data.handleById,
                label: `${data.handleBy.firstName} ${data.handleBy.lastName}`,
              }
            : undefined
          const customer = {
            id: data.customerId,
            label: data.customer.name,
          }

          const payload = {
            customer,
            handleBy,
            signature: data.signature,
            pickupAt: data.pickupAt,
            notes: data.notes,
            localization: data.localization,
            content: data.content,
            type: data.type || []
          }

          reset(payload)
          setOrderData(res.data)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingData(false))
    }
  }, [orderId, reset])

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
    }
    delete payload.customer
    delete payload.handleBy

    await axios
      .post(`/api/order/${orderId}/update`, payload)
      .then((res) => {
        if (res.status === 200) goBack()
      })
      .catch((err) => {
        console.error('WYSTĄPIŁ BŁĄD', orderId, err)
      })
  }

  useEffect(() => {
    handleGetOrderDetails()
  }, [handleGetOrderDetails])

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
        <Typography variant="h1">Szczegóły odbioru</Typography>
        <Grid
          xs={12}
          container
          sx={{
            my: 3,
          }}
        >
          {orderData ? (
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
                          <Typography>{orderData.no}</Typography>
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
                          <Typography>{dayjs(orderData.createdAt).format(DateTimeTemplate.DDMMYYYYHHmm)}</Typography>
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
                            {[
                              OrderType.BIOLOGY,
                              OrderType.PHYSICOCHEMISTRY,
                              OrderType.TOXYCOLOGY,
                              OrderType.FATHERHOOD,
                            ].map((el) => (
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
                          <Typography>{formatFullName(orderData.registeredBy)}</Typography>
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
                        name="pickupAt"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <DatePicker
                            {...rest}
                            value={value ? dayjs(value) : null}
                            onChange={(date) => onChange(dayjs(date).format())}
                            label="Data odbioru"
                            format={DateTemplate.DDMMYYYY}
                          />
                        )}
                      />
                      <Grid xs={12}>
                        <Stack>
                          <Typography
                            color="text.secondary"
                            variant="overline"
                          >
                            Załączniki
                          </Typography>
                          {orderData.attachment.length ? (
                            orderData.attachment.map((att) => (
                              <Box key={att}>
                                <Link
                                  href={`/upload/${att}`}
                                  target="_blank"
                                  sx={{ textDecoration: 'none', color: 'primary' }}
                                  download={renameDownloadFile(att)}
                                >
                                  {renameDownloadFile(att)}
                                </Link>
                              </Box>
                            ))
                          ) : (
                            <Typography>Brak załączników</Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Informacje dodatkowe / notatki"
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
            <Loader />
          )}
        </Grid>
      </Layout>
      <DeleteOrderConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.onClose}
        onConfirm={handleDeleteOrder}
        data={orderData}
      />
    </>
  )
}

export default OrderPreview
