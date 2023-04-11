import { OrderType } from '@src/types'
import { DeviceHub, Face, Pix, Spa } from '@mui/icons-material'

export const getTypeIcon = (type: OrderType) => {
  switch (type) {
    case OrderType.FATHERHOOD:
      return <Face />
    case OrderType.BIOLOGY:
      return <Spa />
    case OrderType.TOXYCOLOGY:
      return <DeviceHub />
    case OrderType.PHYSICOCHEMISTRY:
      return <Pix />
  }
}
