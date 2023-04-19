import { Box, Chip, CircularProgress, Link, Paper, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate, renameDownloadFile } from '@src/utils'
import { Customer, Return, User } from '@prisma/client'
import { OrderType, Paths } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { translatedType } from '@src/utils/textFormatter'
import { StatusSelector } from '@components/Orders'
import { usePath } from '@src/hooks'

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

const ReturnPreview = () => {
  const [returnData, setReturnData] = useState<ReturnProps | null>(null)
  const router = useRouter()
  const { returnId } = router.query

  const handleGetReturnDetails = useCallback(() => {
    returnId && axios.get(`/api/return/${returnId}`).then((res) => setReturnData(res.data))
  }, [returnId])

  useEffect(() => {
    handleGetReturnDetails()
  }, [handleGetReturnDetails])

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
        {returnData ? (
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
                    <Typography>{returnData.id}</Typography>
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
                    <Typography>{returnData.signature}</Typography>
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
                      {returnData.type.map((type: OrderType) => (
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
                      status={returnData.status}
                      orderId={returnId as string}
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
                    <Typography>{dayjs(returnData.createdAt).format(DateTimeTemplate.DDMMYYYYHHmm)}</Typography>
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
                    <Typography>{`${returnData.handleBy.firstName} ${returnData.handleBy.lastName}`}</Typography>
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
                    <Typography>{returnData.localization}</Typography>
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
                    <Typography>{dayjs(returnData.createdAt).locale('pl').format(DateTemplate.DDMMMMYYYY)}</Typography>
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
                    <Typography>{`${returnData.registeredBy.firstName} ${returnData.handleBy.lastName}`}</Typography>
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
                    {returnData.attachment.length ? (
                      returnData.attachment.map((att) => (
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
                    <Typography sx={{ whiteSpace: 'pre' }}>{returnData.notes}</Typography>
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

export default ReturnPreview
