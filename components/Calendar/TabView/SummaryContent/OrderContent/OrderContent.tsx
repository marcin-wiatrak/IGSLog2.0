import { Order } from '@prisma/client'
import { Card, CardContent, Chip, Typography, Unstable_Grid2 as MuiGrid } from '@mui/material'
import { translatedStatus, translatedType } from '@src/utils/textFormatter'
import { OrderType } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { getCustomerNameById } from '@src/utils/utils'
import { useGetCustomersList } from '@src/hooks'

type OrderContentProps = {
  orderData: Order & { list?: string }
}

export const OrderContent = ({ orderData }: OrderContentProps) => {
  const { customersList } = useGetCustomersList()

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
      key={orderData.id}
      onClick={() => console.log('goToInfo', orderData.id)}
      sx={{ '&:hover': { boxShadow: 3, cursor: 'pointer' }, mb: 1, flex: 1 }}
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
              label={orderData.signature}
              color="success"
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
              label={translatedStatus[orderData.status]}
              color="success"
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
              {orderData.type.map((type: OrderType) => (
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
              label={getCustomerNameById(orderData.customerId, customersList)}
              color="success"
            />
          </Grid>
        </MuiGrid>
      </CardContent>
    </Card>
  )
}
