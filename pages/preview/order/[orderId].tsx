import { Box, Chip, CircularProgress, Link, Paper, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate, getFullName, renameDownloadFile } from '@src/utils'
import { Customer, Order, User } from '@prisma/client'
import { OrderType, Paths } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { formatFullName, translatedType } from '@src/utils/textFormatter'
import { StatusSelector } from '@components/Orders'
import { usePath } from '@src/hooks'

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

const OrderPreview = () => {
  const [orderData, setOrderData] = useState<OrderProps | null>(null)
  const router = useRouter()
  const { orderId } = router.query

  const handleGetOrderDetails = useCallback(() => {
    orderId && axios.get(`/api/order/${orderId}`).then((res) => setOrderData(res.data))
  }, [orderId])

  useEffect(() => {
    handleGetOrderDetails()
  }, [handleGetOrderDetails])

  usePath(Paths.ORDERS)

  return (
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
          <Grid xs={12}>
            <Paper
              sx={{
                p: 2,
              }}
            >
              <Grid
                xs={12}
                container
                spacing={2}
              >
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      ID
                    </Typography>
                    <Typography>{orderData.id}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Sygnatura
                    </Typography>
                    <Typography>{orderData.signature}</Typography>
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
                      {orderData.type.map((type: OrderType) => (
                        <Chip
                          key={type}
                          avatar={getTypeIcon(type)}
                          label={translatedType[type]}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Status
                    </Typography>
                    <StatusSelector
                      status={orderData.status}
                      orderId={orderId as string}
                    />
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
                      Osoba odpowiedzialna
                    </Typography>
                    {orderData.handleBy ? (
                      <Typography>{formatFullName(orderData.handleBy)}</Typography>
                    ) : (
                      <Typography color="text.secondary">(brak przypisanej osoby)</Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Miejsce odbioru
                    </Typography>
                    {orderData.localization ? (
                      <Typography>{orderData.localization}</Typography>
                    ) : (
                      <Typography color="text.secondary">(brak miejsca odbioru)</Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Data odbioru
                    </Typography>
                    <Typography>{dayjs(orderData.createdAt).locale('pl').format(DateTemplate.DDMMMMYYYY)}</Typography>
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

                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Informacje dodatkowe/notatki
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre' }}>{orderData.notes}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ) : (
          <Loader />
        )}
      </Grid>
    </Layout>
  )
}

export default OrderPreview
