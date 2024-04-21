import { Box, Button, ButtonGroup, IconButton, Stack, TextField } from '@mui/material'
import { ORDER_TYPE_BUTTONS_LIST, RETURN_TYPE_BUTTONS_LIST } from './FilterButtons.constants'
import { FC, useEffect, useState } from 'react'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors, ordersActions, ordersSelectors } from '@src/store'
import { getTypeIcon } from '@src/utils/typeIcons'
import { OrderType, Paths } from '@src/types'

type FilterButtonsProps = {
  onClearFiltersClick: () => void
  onFilterDrawerOpen: () => void
  disableTypes?: boolean
}

export const FilterButtons: FC<FilterButtonsProps> = ({ onClearFiltersClick, onFilterDrawerOpen, disableTypes = false }) => {
  const dispatch = useDispatch()
  const selectedTypes = useSelector(ordersSelectors.selectFilterByType)
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const [string, setString] = useState('')

  const handleFindStringChange = () => dispatch(commonActions.setFindString( {value: string}))
  const handleClearFindString = () => {
    dispatch(commonActions.setFindString({ value: '' }))
    setString('')
  }

  useEffect(() => {
    const setter = setTimeout(() => {
      handleFindStringChange()
    }, 1000)

    return () => clearTimeout(setter)
  }, [string])

  const handleTypeClick = (type) => {
    dispatch(ordersActions.setFilterByType({ filterByType: type }))
    const LStypes = localStorage.getItem('filterByType${currentPath}')
    if (LStypes === type) {
      localStorage.setItem('filterByType${currentPath}', '')
    }
  }

  useEffect(() => {
    const typesJointString = selectedTypes.join(',')

    if (typesJointString) {
      localStorage.setItem(`filterByType${currentPath}`, selectedTypes.join(','))
    }
  }, [selectedTypes])

  useEffect(() => {
    const LStypes = localStorage.getItem(`filterByType${currentPath}`)
    if (!LStypes) {
      localStorage.setItem(`filterByType${currentPath}`, '')
    }
    if (LStypes !== '' && LStypes !== null) {
      LStypes.split(',').forEach((el: OrderType) => dispatch(ordersActions.setFilterByType({ filterByType: el })))
    }
  }, [currentPath])

  const TYPES_LIST = currentPath === Paths.ORDERS ? ORDER_TYPE_BUTTONS_LIST : RETURN_TYPE_BUTTONS_LIST

  return (
    <>
      {!disableTypes && (
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
        )}
      <Stack
        direction="row"
        spacing={1}
        flex={1}
        justifyContent="flex-end"
      >
        <TextField
          size="small"
          label="Szukaj"
          value={string}
          onChange={({ target }) => setString(target.value)}
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
