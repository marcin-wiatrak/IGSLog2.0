import { Box, Button, ButtonGroup } from '@mui/material'
import { TYPE_BUTTONS_LIST } from './FilterButtons.constants'
import { FC } from 'react'
import { OrderType } from '@src/types'
import { Close, DeviceHub, Face, Pix, Spa } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'

type FilterButtonsProps = {
  onClearFiltersClick: () => void
  onFilterDrawerOpen: () => void
}

export const FilterButtons: FC<FilterButtonsProps> = ({ onClearFiltersClick, onFilterDrawerOpen }) => {
  const dispatch = useDispatch()
  const selectedTypes = useSelector(ordersSelectors.selectFilterByType)

  const icon = (name) => {
    switch (name) {
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

  const handleTypeClick = (type) => {
    dispatch(ordersActions.setFilterByType({ filterByType: type }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: '5px' }}>
        {TYPE_BUTTONS_LIST.map((el) => (
          <Button
            key={el.label}
            onClick={() => handleTypeClick(el.name)}
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
