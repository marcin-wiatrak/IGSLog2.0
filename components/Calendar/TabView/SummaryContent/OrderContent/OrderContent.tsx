import { Card, CardContent, Chip, Typography, Unstable_Grid2 as MuiGrid } from '@mui/material'
import { formatFullName, translatedType } from '@src/utils/textFormatter'
import { OrderExtended, OrderType } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { useRouter } from 'next/router'

type OrderContentProps = {
  orderData: OrderExtended
}

export const OrderContent = ({ orderData }: OrderContentProps) => {
  const router = useRouter()

  const Grid = ({ children }) => (
    <MuiGrid
      xs={12}
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
    >
      {children}
    </MuiGrid>
  )

  return (
    <Card
      key={orderData.id}
      onClick={() => router.push(`/preview/order/${orderData.id}`)}
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
              LP:
            </Typography>
            <Chip
              label={orderData.no}
              color="success"
            />
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              IGS/Sygnatura:
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
              Miejsce odbioru:
            </Typography>
            <Chip
              label={orderData.localization}
              color="success"
            />
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Osoba odpowiedzialna:
            </Typography>
            {orderData.handleBy && (
              <Chip
                label={formatFullName(orderData.handleBy)}
                color="success"
              />
            )}
          </Grid>
        </MuiGrid>
      </CardContent>
    </Card>
  )
}
