import { Box, Button, ButtonGroup, IconButton, Stack, TextField } from '@mui/material'
import { ORDER_TYPE_BUTTONS_LIST, RETURN_TYPE_BUTTONS_LIST } from './FilterButtons.constants'
import { FC, useEffect } from 'react'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors, ordersActions, ordersSelectors } from '@src/store'
import { getTypeIcon } from '@src/utils/typeIcons'
import { OrderType, Paths } from '@src/types'

type FilterButtonsProps = {
  onClearFiltersClick: () => void
  onFilterDrawerOpen: () => void
}

export const FilterButtons: FC<FilterButtonsProps> = ({ onClearFiltersClick, onFilterDrawerOpen }) => {
  const dispatch = useDispatch()
  const selectedTypes = useSelector(ordersSelectors.selectFilterByType)
  const findString = useSelector(commonSelectors.selectFindString)
  const currentPath = useSelector(commonSelectors.selectCurrentPath)

  const handleFindStringChange = (value) => dispatch(commonActions.setFindString({ value }))
  const handleClearFindString = () => dispatch(commonActions.setFindString({ value: '' }))


  const handleTypeClick = (type) => {
    dispatch(ordersActions.setFilterByType({ filterByType: type }))
    const LStypes = localStorage.getItem('filterByType')
    if (LStypes === type) {
      localStorage.setItem('filterByType', '')
    }
  }

  useEffect(() => {
    const typesJointString = selectedTypes.join(',')

    if (typesJointString) {
      localStorage.setItem('filterByType', selectedTypes.join(','))
    }

    console.log('selectedTypes', selectedTypes);
  }, [selectedTypes])

  useEffect(() => {
    const LStypes = localStorage.getItem('filterByType')
    if (!LStypes) {
      localStorage.setItem('filterByType', '')
    }
    if (LStypes !== '' && LStypes !== null) {
      LStypes.split(',').forEach((el: OrderType) => dispatch(ordersActions.setFilterByType({ filterByType: el })))
    }
  }, [])

  const TYPES_LIST = currentPath === Paths.ORDERS ? ORDER_TYPE_BUTTONS_LIST : RETURN_TYPE_BUTTONS_LIST

  return (
    <>
      <Box sx={{ display: 'flex', gap: '5px' }}>
        {TYPES_LIST.map((el) => (
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
      <Stack
        direction="row"
        spacing={1}
      >
        <TextField
          size="small"
          label="Szukaj"
          value={findString}
          onChange={({ target }) => handleFindStringChange(target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleClearFindString}
                size="small"
              >
                <Close />
              </IconButton>
            ),
          }}
        />
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
      </Stack>
    </>
  )
}
