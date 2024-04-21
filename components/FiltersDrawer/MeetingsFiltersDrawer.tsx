import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { FC, useMemo } from 'react'
import { meetingsActions, meetingsSelectors, returnsActions, returnsSelectors } from '@src/store'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { SideDrawer } from '@components/SideDrawer'
import { Close } from '@mui/icons-material'
import { useGetUsersList } from '@src/hooks'
import { useGetUnitsList } from '@src/hooks/useGetUnitsList/useGetUnitsList'

type FiltersDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const MeetingsFiltersDrawer: FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
  const { usersList: users } = useGetUsersList()
  const { unitsList } = useGetUnitsList()
  const filters = useSelector(meetingsSelectors.selectFilters)

  const dispatch = useDispatch()

  const unitsOptions = useMemo(() => {
    return unitsList?.map(({ id, name }) => ({ id, label: name })) ?? []
  }, [unitsList])

  const usersOptions = useMemo(() => {
    return users.map(({ id, firstName, lastName }) => ({ id, label: `${firstName} ${lastName}` }))
  }, [users])

  const handleChangeFilterUnit = (_, newValue) =>
    dispatch(meetingsActions.setFilters({ unit: newValue }))

  const handleChangeFilterUserId = (_, newValue) => dispatch(meetingsActions.setFilters({ handleBy: newValue }))

  const handleChangeFilterCreatedAtStart = (date) =>
    dispatch(meetingsActions.setFilters({ createdAtStart: dayjs(date).format() }))

  const handleChangeFilterCreatedAtEnd = (date) =>
    dispatch(meetingsActions.setFilters({ createdAtEnd: dayjs(date).endOf('day').format() }))

  const handleChangeFilterMeetingAtStart = (date) =>
    dispatch(meetingsActions.setFilters({ meetingAtStart: dayjs(date).format() }))

  const handleChangeFilterMeetingAtEnd = (date) =>
    dispatch(meetingsActions.setFilters({ meetingAtEnd: dayjs(date).endOf('day').format() }))

  const resetFilters = () => dispatch(meetingsActions.clearFilters())

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
          value={filters.unit as any[]}
          onChange={handleChangeFilterUnit}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Jednostka"
            />
          )}
          options={unitsOptions}
        />
        <Autocomplete
          multiple
          value={filters.handleBy as any[]}
          onChange={handleChangeFilterUserId}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Osoba odpowiedzialna"
            />
          )}
          options={usersOptions}
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
            Data spotkania
          </Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <DatePicker
              label="od"
              value={dayjs(filters.meetingAtStart)}
              onChange={handleChangeFilterMeetingAtStart}
            />
            <DatePicker
              label="do"
              value={dayjs(filters.meetingAtEnd)}
              onChange={handleChangeFilterMeetingAtEnd}
            />
          </Stack>
        </Stack>
      </Stack>
    </SideDrawer>
  )
}
