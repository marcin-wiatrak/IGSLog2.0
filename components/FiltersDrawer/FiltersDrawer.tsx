import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { FC, useMemo } from 'react'
import { commonSelectors, ordersActions, ordersSelectors, returnsActions, returnsSelectors } from '@src/store'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { SideDrawer } from '@components/SideDrawer'
import { Close } from '@mui/icons-material'
import { OrderStatuses, Paths } from '@src/types'
import { useGetUsersList } from '@src/hooks'

type FiltersDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const FiltersDrawer: FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const { usersList: users } = useGetUsersList()
  const ordersFilter = useSelector(ordersSelectors.selectFilterRegisteredBy)
  const returnsFilters = useSelector(returnsSelectors.selectFilters)

  const filters = currentPath === Paths.ORDERS ? ordersFilter : returnsFilters

  const dispatch = useDispatch()

  const usersOptions = useMemo(() => {
    return users.map(({ id, firstName, lastName }) => ({ id, label: `${firstName} ${lastName}` }))
  }, [users])

  const handleByOptions = useMemo(() => {
    return [{ id: null, label: 'Nieprzypisany' }, ...usersOptions]
  }, [usersOptions])

  const handleChangeFilterRegisteredBy = (_, newValue) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterRegisteredBy({ filterRegisteredBy: newValue }))
      : dispatch(returnsActions.setFilters({ registeredBy: newValue }))
  }

  const handleChangeFilterUserId = (_, newValue) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterUserId({ filterHandleBy: newValue }))
      : dispatch(returnsActions.setFilters({ handleBy: newValue }))
  }

  const handleChangeFilterLocalization = ({ target }) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterLocalization({ filterLocalization: target.value }))
      : dispatch(returnsActions.setFilters({ localization: target.value }))
  }

  const handleChangeFilterCreatedAtStart = (date) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterCreatedAtStart({ filterCreatedAtStart: dayjs(date).format() }))
      : dispatch(returnsActions.setFilters({ createdAtStart: dayjs(date).format() }))
  }

  const handleChangeFilterCreatedAtEnd = (date) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterCreatedAtEnd({ filterCreatedAtEnd: dayjs(date).endOf('day').format() }))
      : dispatch(returnsActions.setFilters({ createdAtEnd: dayjs(date).endOf('day').format() }))
  }

  const handleChangeFilterStatus = ({ target }) => {
    currentPath === Paths.ORDERS
      ? dispatch(ordersActions.setFilterStatus({ status: target.value }))
      : dispatch(returnsActions.setFilters({ status: target.value }))
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
          value={filters.registeredBy as any[]}
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
          value={filters.handleBy as any[]}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                key={option.id}
              >
                {option.label}
              </li>
            )
          }}
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
        <FormControl
        >
          <InputLabel id="role-label">Status</InputLabel>
        <Select

          label="Status"
          value={filters.status}
          onChange={handleChangeFilterStatus}
        >
          <MenuItem value="NEW">Zarejestrowano</MenuItem>
          <MenuItem value="PICKED_UP">Ustalone</MenuItem>
          <MenuItem value="DELIVERED">Odebrane</MenuItem>
          <MenuItem value="CLOSED">Zakończone</MenuItem>
          <MenuItem value="PAUSED">Wstrzymane</MenuItem>
        </Select>
        </FormControl>
      </Stack>
    </SideDrawer>
  )
}
