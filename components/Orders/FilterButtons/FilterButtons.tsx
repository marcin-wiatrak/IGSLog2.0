import { Box, Button, ButtonGroup } from '@mui/material'
import { TYPE_BUTTONS_LIST } from './FilterButtons.constants'
import { FC } from 'react'
import { OrderType } from '@src/types'
import { Close, DeviceHub, Face, Pix, Spa } from '@mui/icons-material'

type FilterButtonsProps = {
  onTypeClick: (type: OrderType) => void
  onClearFiltersClick: () => void
  onFilterDrawerOpen: () => void
  selectedTypes: OrderType[]
}

export const FilterButtons: FC<FilterButtonsProps> = ({
  onTypeClick,
  onClearFiltersClick,
  onFilterDrawerOpen,
  selectedTypes,
}) => {
  const icon = (name) => {
    switch (name) {
      case OrderType.FATHERHOOD:
        return <Face />
      case OrderType.BIOLOGY:
        return <Spa />
      case OrderType.TOXYCOLOGY:
        return <DeviceHub />
      case OrderType.PHYSYCOCHEMISTRY:
        return <Pix />
    }
  }

  return (
    <>
      <Box>
        {TYPE_BUTTONS_LIST.map((el) => (
          <Button
            key={el.label}
            onClick={() => onTypeClick(el.name)}
            startIcon={icon(el.name)}
            color="primary"
            variant={selectedTypes.includes(el.name) ? 'contained' : 'outlined'}
            sx={{ width: { xs: '100%', sm: 'unset' } }}
          >
            {el.label}
          </Button>
        ))}
      </Box>
      <ButtonGroup
        variant="contained"
        sx={{ marginTop: { xs: '5px', sm: 0 } }}
      >
        <Button
          fullWidth
          onClick={onFilterDrawerOpen}
        >
          Filtruj
        </Button>
        <Button
          size="small"
          onClick={onClearFiltersClick}
        >
          <Close />
        </Button>
      </ButtonGroup>
    </>
  )
}
