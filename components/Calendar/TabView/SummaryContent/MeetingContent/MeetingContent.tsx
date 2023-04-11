import { Meeting } from '@prisma/client'
// import { Box, Card, CardContent, Typography, Unstable_Grid2 as Grid } from '@mui/material'
// import { translatedStatus, translatedType } from '@src/utils/textFormatter'
// import { OrderType } from '@src/types'
// import { getTypeIcon } from '@src/utils/typeIcons'
// import { getCustomerNameById } from '@src/utils/utils'
// import { useGetCustomersList } from '@src/hooks'

type OrderContentProps = {
  meetingData: Meeting
}

export const MeetingContent = ({ meetingData }: OrderContentProps) => {
  // const { customersList } = useGetCustomersList()

  return (
    <></>
    // <Card
    //   key={meetingData.id}
    //   onClick={() => console.log('goToInfo', meetingData.id)}
    //   sx={{ '&:hover': { boxShadow: 3, cursor: 'pointer' }, mb: 1 }}
    // >
    //   <CardContent>
    //     <Grid container>
    //       <Grid xs={6}>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //         >
    //           IGS:
    //         </Typography>
    //         <Typography>{meetingData.signature}</Typography>
    //       </Grid>
    //       <Grid xs={6}>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //         >
    //           STATUS:
    //         </Typography>
    //         <Typography>{translatedStatus[meetingData.status]}</Typography>
    //       </Grid>
    //       <Grid xs={6}>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //         >
    //           TYP:
    //         </Typography>
    //         {meetingData.type.map((type: OrderType) => (
    //           <Box
    //             key={type}
    //             sx={{ display: 'flex', gap: 1 }}
    //           >
    //             {getTypeIcon(type)}
    //             <Typography textTransform="uppercase">{translatedType[type]}</Typography>
    //           </Box>
    //         ))}
    //       </Grid>
    //       <Grid xs={6}>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //         >
    //           ZLECENIODAWCA:
    //         </Typography>
    //         <Typography>{getCustomerNameById(meetingData.customerId, customersList)}</Typography>
    //       </Grid>
    //     </Grid>
    //   </CardContent>
    // </Card>
  )
}
