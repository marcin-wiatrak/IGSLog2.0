import { Box, Button, ButtonGroup } from '@mui/material'
import { TYPE_BUTTONS_LIST } from './FilterButtons.constants'
import { FC } from 'react'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'
import { getTypeIcon } from '@src/utils/typeIcons'

type FilterButtonsProps = {
  onClearFiltersClick: () => void
  onFilterDrawerOpen: () => void
}

export const FilterButtons: FC<FilterButtonsProps> = ({ onClearFiltersClick, onFilterDrawerOpen }) => {
  const dispatch = useDispatch()
  const selectedTypes = useSelector(ordersSelectors.selectFilterByType)

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
            startIcon={getTypeIcon(el.name)}
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
