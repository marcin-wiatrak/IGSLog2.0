import { CircularProgress, Paper, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Meeting, Unit, User } from '@prisma/client'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate } from '@src/utils'
import { useSession } from 'next-auth/react'

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

const MeetingPreview = () => {
  const [meetingData, setMeetingData] = useState<MeetingProps | null>(null)
  const router = useRouter()
  const { meetingId } = router.query

  const handleGetMeetingDetails = useCallback(() => {
    meetingId && axios.get(`/api/meeting/${meetingId}`).then((res) => setMeetingData(res.data))
  }, [meetingId])

  useEffect(() => {
    handleGetMeetingDetails()
  }, [handleGetMeetingDetails])

  console.log(meetingData)

  return (
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
                      ID:
                    </Typography>
                    <Typography>{meetingData.id}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Data utworzenia:
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
                      Data spotkania:
                    </Typography>
                    <Typography>{dayjs(meetingData.date).locale('pl').format(DateTemplate.DDMMMMYYYY)}</Typography>
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
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Przedstawiciel jednostki:
                    </Typography>
                    <Typography>{meetingData.unitAgent}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Kontakt:
                    </Typography>
                    <Typography>{meetingData.contact}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Osoba odpowiedzialna:
                    </Typography>
                    <Typography>{`${meetingData.handleBy.firstName} ${meetingData.handleBy.lastName}`}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Ustalenia:
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre' }}>{meetingData.details}</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography
                      color="text.secondary"
                      variant="overline"
                    >
                      Informacje dodatkowe/notatki:
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre' }}>{meetingData.notes}</Typography>
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

export default MeetingPreview
