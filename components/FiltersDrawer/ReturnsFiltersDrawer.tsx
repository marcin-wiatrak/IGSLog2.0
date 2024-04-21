import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { FC, useMemo } from 'react'
import { returnsActions, returnsSelectors } from '@src/store'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { SideDrawer } from '@components/SideDrawer'
import { Close } from '@mui/icons-material'
import { useGetUsersList } from '@src/hooks'

type FiltersDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const ReturnsFiltersDrawer: FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
  const { usersList: users } = useGetUsersList()
  const filters = useSelector(returnsSelectors.selectFilters)

  const dispatch = useDispatch()

  const usersOptions = useMemo(() => {
    return users.map(({ id, firstName, lastName }) => ({ id, label: `${firstName} ${lastName}` }))
  }, [users])

  const handleByOptions = useMemo(() => {
    return [{ id: null, label: 'Nieprzypisany' }, ...usersOptions]
  }, [usersOptions])

  const handleChangeFilterRegisteredBy = (_, newValue) =>
    dispatch(returnsActions.setFilters({ registeredBy: newValue }))

  const handleChangeFilterUserId = (_, newValue) => dispatch(returnsActions.setFilters({ handleBy: newValue }))

  const handleChangeFilterLocalization = ({ target }) =>
    dispatch(returnsActions.setFilters({ localization: target.value }))

  const handleChangeFilterCreatedAtStart = (date) =>
    dispatch(returnsActions.setFilters({ createdAtStart: dayjs(date).format() }))

  const handleChangeFilterCreatedAtEnd = (date) =>
    dispatch(returnsActions.setFilters({ createdAtEnd: dayjs(date).endOf('day').format() }))

  const handleChangeFilterReturnAtStart = (date) =>
    dispatch(returnsActions.setFilters({ returnAtStart: dayjs(date).format() }))

  const handleChangeFilterReturnAtEnd = (date) =>
    dispatch(returnsActions.setFilters({ returnAtEnd: dayjs(date).endOf('day').format() }))

  const handleChangeFilterStatus = ({ target }) => dispatch(returnsActions.setFilters({ status: target.value }))

  const resetFilters = () => dispatch(returnsActions.clearFilters())

  return (
    <SideDrawer
      title="Filtruj zlecenia"
      anchor="right"
      variant="temporary"
      onClose={onClose}
      open={isOpen}
      actionsList={[
        {
          label: 'Wyczyść filtry',
          variant: 'contained',
          startIcon: <Close />,
          fullWidth: true,
          onClick: resetFilters,
        },
      ]}
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
          label="Miejsce zwrotu"
          value={filters.localization}
          onChange={handleChangeFilterLocalization}
        />
        <Stack
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}
          spacing={2}
        >
          <Typography
            variant="body1"
            color="grey"
          >
            Data utworzenia
          </Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <DatePicker
              label="od"
              value={dayjs(filters.createdAtStart)}
              onChange={handleChangeFilterCreatedAtStart}
            />
            <DatePicker
              label="do"
              value={dayjs(filters.createdAtEnd)}
              onChange={handleChangeFilterCreatedAtEnd}
            />
          </Stack>
        </Stack>
        <Stack
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}
          spacing={2}
        >
          <Typography
            variant="body1"
            color="grey"
          >
            Data zwrotu
          </Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <DatePicker
              label="od"
              value={dayjs(filters.returnAtStart)}
              onChange={handleChangeFilterReturnAtStart}
            />
            <DatePicker
              label="do"
              value={dayjs(filters.returnAtEnd)}
              onChange={handleChangeFilterReturnAtEnd}
            />
          </Stack>
        </Stack>
        <FormControl>
          <InputLabel id="role-label">Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={handleChangeFilterStatus}
            multiple
          >
            <MenuItem value="NEW">Zarejestrowane</MenuItem>
            <MenuItem value="SET">Zwrot ustalony</MenuItem>
            <MenuItem value="CLOSED">Zakończone</MenuItem>
            <MenuItem value="PAUSED">Wstrzymane</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </SideDrawer>
  )
}
