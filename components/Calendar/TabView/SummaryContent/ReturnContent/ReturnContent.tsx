import { Return } from '@prisma/client'
import { Box, Card, CardContent, Chip, Typography, Unstable_Grid2 as MuiGrid } from '@mui/material'
import { translatedStatus, translatedType } from '@src/utils/textFormatter'
import { OrderType } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { getCustomerNameById } from '@src/utils/utils'
import { useGetCustomersList } from '@src/hooks'

type ReturnContentProps = {
  returnData: Return
}

export const ReturnContent = ({ returnData }: ReturnContentProps) => {
  const { customersList } = useGetCustomersList()

  if (!customersList) return null

  const Grid = ({ children }) => (
    <MuiGrid
      xs={6}
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      {children}
    </MuiGrid>
  )

  return (
    <Card
      onClick={() => console.log('goToInfo', returnData.id)}
      sx={{ '&:hover': { boxShadow: 3, cursor: 'pointer' }, mb: 1 }}
    >
      <CardContent>
        <MuiGrid
          container
          rowSpacing={1}
        >
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              IGS:
            </Typography>
            <Chip
              label={returnData.signature}
              color="warning"
            />
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              STATUS:
            </Typography>
            <Chip
              label={translatedStatus[returnData.status]}
              color="warning"
            />
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              TYP:
            </Typography>
            <div>
              {returnData.type.map((type: OrderType) => (
                <Chip
                  key={type}
                  avatar={getTypeIcon(type)}
                  label={translatedType[type]}
                  size="small"
                />
              ))}
            </div>
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              ZLECENIODAWCA:
            </Typography>

            <Chip
              label={getCustomerNameById(returnData.customerId, customersList)}
              color="warning"
            />
          </Grid>
        </MuiGrid>
      </CardContent>
    </Card>
  )
}
