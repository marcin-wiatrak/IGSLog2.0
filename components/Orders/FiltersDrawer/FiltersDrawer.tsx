import { Autocomplete, Stack, TextField } from '@mui/material'
import { FC, useMemo } from 'react'
import { ordersActions, ordersSelectors, usersSelectors } from '@src/store'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { SideDrawer } from '@components/SideDrawer'
import { Close } from '@mui/icons-material'

type FiltersDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const FiltersDrawer: FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
  const users = useSelector(usersSelectors.selectUsersList)
  const filters = useSelector(ordersSelectors.selectFilterRegisteredBy)

  const dispatch = useDispatch()

  const usersOptions = useMemo(() => {
    return users.map(({ id, firstName, lastName }) => ({ id, label: `${firstName} ${lastName}` }))
  }, [users])

  const handleByOptions = useMemo(() => {
    return [{ id: null, label: 'Nieprzypisany' }, ...usersOptions]
  }, [usersOptions])

  const handleChangeFilterRegisteredBy = (_, newValue) => {
    dispatch(ordersActions.setFilterRegisteredBy({ filterRegisteredBy: newValue }))
  }

  const handleChangeFilterUserId = (_, newValue) => {
    dispatch(ordersActions.setFilterUserId({ filterHandleBy: newValue }))
  }

  const handleChangeFilterLocalization = ({ target }) => {
    dispatch(ordersActions.setFilterLocalization({ filterLocalization: target.value }))
  }

  const handleChangeFilterCreatedAtStart = (date) => {
    dispatch(ordersActions.setFilterCreatedAtStart({ filterCreatedAtStart: dayjs(date).format() }))
  }
  const handleChangeFilterCreatedAtEnd = (date) => {
    dispatch(ordersActions.setFilterCreatedAtEnd({ filterCreatedAtEnd: dayjs(date).endOf('day').format() }))
  }

  return (
    <SideDrawer
      title="Filtruj zlecenia"
      anchor="right"
      variant="temporary"
      onClose={onClose}
      open={isOpen}
      actionsList={[{ label: 'Wyczyść filtry', variant: 'contained', startIcon: <Close />, fullWidth: true }]}
    >
      <Stack spacing={3}>
        <Autocomplete
          multiple
          value={filters.registeredBy}
          onChange={handleChangeFilterRegisteredBy}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rejestrujący"
            />
          )}
          options={usersOptions}
        />
        <Autocomplete
          multiple
          value={filters.handleBy}
          onChange={handleChangeFilterUserId}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Osoba odpowiedzialna"
            />
          )}
          options={handleByOptions}
        />
        <TextField
          label="Miejsce odbioru"
          value={filters.localization}
          onChange={handleChangeFilterLocalization}
        />
        <DatePicker
          label="Data utworzenia OD"
          value={dayjs(filters.createdAtStart)}
          onChange={handleChangeFilterCreatedAtStart}
        />
        <DatePicker
          label="Data utworzenia DO"
          value={dayjs(filters.createdAtEnd)}
          onChange={handleChangeFilterCreatedAtEnd}
        />
      </Stack>
    </SideDrawer>
  )
}
