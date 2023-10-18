import { Card, CardContent, Chip, Typography, Unstable_Grid2 as MuiGrid } from '@mui/material'
import { formatFullName, translatedType } from '@src/utils/textFormatter'
import { OrderType, ReturnExtended } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { useGetCustomersList } from '@src/hooks'
import { useRouter } from 'next/router'

type ReturnContentProps = {
  returnData: ReturnExtended
}

export const ReturnContent = ({ returnData }: ReturnContentProps) => {
  const { customersList } = useGetCustomersList()
  const router = useRouter()

  if (!customersList) return null

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
      onClick={() => router.push(`/preview/return/${returnData.id}`)}
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
              LP:
            </Typography>
            <Chip
              label={returnData.no}
              color="warning"
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
              label={returnData.signature}
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
              Miejsce zwrotu:
            </Typography>
            <Chip
              label={returnData.localization}
              color="warning"
            />
          </Grid>
          <Grid>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Osoba odpowiedzialna:
            </Typography>
            {returnData.handleBy && (
              <Chip
                label={formatFullName(returnData.handleBy)}
                color="warning"
              />
            )}
          </Grid>
        </MuiGrid>
      </CardContent>
    </Card>
  )
}
