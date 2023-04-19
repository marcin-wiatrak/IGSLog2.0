import { Box, Chip, Stack } from '@mui/material'
import { OrderType } from '@src/types'
import { getTypeIcon } from '@src/utils/typeIcons'
import { translatedType } from '@src/utils/textFormatter'

type TypeElementProps = {
  types: string[]
}

export const TypeElement = ({ types }: TypeElementProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {types.map((type: OrderType) => (
        <Chip
          key={type}
          avatar={getTypeIcon(type)}
          label={translatedType[type]}
          size="small"
        />
      ))}
    </Box>
  )
}
