import { TablePaginator } from '@components/TablePaginator'
import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Table,
  Typography,
  IconButton,
} from '@mui/material'
import { usePagination } from '@src/hooks/usePagination'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetMeetingsList } from '@src/hooks/useGetMeetingsList'
import { TableOrderDirection } from '@src/types'
import { useSelector } from 'react-redux'
import { commonSelectors, meetingsSelectors, usersSelectors } from '@src/store'
import dayjs from 'dayjs'
import { DateTemplate, DateTimeTemplate, getFullName } from '@src/utils'
import { useGetUsersList } from '@src/hooks'
import { useGetUnitsList } from '@src/hooks/useGetUnitsList/useGetUnitsList'
import { Info } from '@mui/icons-material'
import Link from 'next/link'
import { Customer, Meeting, Return } from '@prisma/client'
import * as R from 'ramda'

const COLUMNS_SETUP = [
  {
  name: 'no',
  label: 'LP',
  displayMobile: true,
  allowSorting: true,
},
  {
    name: 'unit',
    label: 'Jednostka',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'contact',
    label: 'Dane kontaktowe',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'unitAgent',
    label: 'Przedstawiciel jednostki',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'date',
    label: 'Data',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'handleById',
    label: 'Osoba odpowiedzialna',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'details',
    label: 'Ustalenia',
    displayMobile: true,
    allowSorting: false,
  },
]

export const MeetingsTable = () => {
  const { usersList } = useGetUsersList()
  const [sortBy, setSortBy] = useState('no')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')
  const { getMeetingsList, meetingsList } = useGetMeetingsList()
  const { unitsList } = useGetUnitsList()
  const filters = useSelector(meetingsSelectors.selectFilters)
  const findString = useSelector(commonSelectors.selectFindString)

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const filterOrders = useCallback(
    (meetings: Meeting[]) =>
      meetings.filter(
        (meeting) =>
          (filters.handleBy.length ? filters.handleBy.some((el) => el.id === meeting.handleById) : true) &&
          (filters.unit.length ? filters.unit.some((el) => el.id === meeting.unitId) : true) &&
          (filters.createdAtStart ? dayjs(meeting.createdAt).isAfter(filters.createdAtStart) : true) &&
          (filters.createdAtEnd ? dayjs(meeting.createdAt).isBefore(filters.createdAtEnd) : true) &&
          (filters.meetingAtStart ? dayjs(meeting.date).isAfter(filters.meetingAtStart) : true) &&
          (filters.meetingAtEnd ? dayjs(meeting.date).isBefore(filters.meetingAtEnd) : true) &&
          ((findString ? meeting.unitAgent.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? meeting.notes.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? meeting.details.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? meeting.no.toString().includes(findString.toLowerCase()) : true))
      ),
    [filters.unit, filters.createdAtEnd, filters.createdAtStart, filters.meetingAtStart, filters.meetingAtEnd, filters.handleBy, findString]
  )

  const sortOrders = useCallback(
    (returns) => {
      if (sortBy === 'returnAt') {
        const isNull = R.pipe(R.prop(sortBy), R.isNil)
        const sort =
          sortDirection === 'asc'
            ? R.sortWith([R.ascend(R.pipe(isNull)), R.ascend(R.prop(sortBy))])
            : R.sortWith([R.descend(R.pipe(isNull, R.not)), R.descend(R.prop(sortBy))])
        return sort(returns)
      } else {
        const sort =
          sortDirection === 'asc'
            ? R.sortWith([R.ascend(R.prop('createdAt') || '')])
            : R.sortWith([R.descend(R.prop('createdAt') || '')])
        return sort(returns)
      }
    },
    [sortBy, sortDirection]
  )

  const tableData = useMemo(() => {
    return sortOrders(filterOrders(meetingsList))
  }, [meetingsList, sortOrders, filterOrders])

  const { handlePagination, ...pagination } = usePagination(tableData, 10)

  useEffect(() => {
    getMeetingsList()
  }, [getMeetingsList])

  const mappedUsersList = useMemo(() => {
    if (usersList.length) {
      return usersList.reduce((acc, user) => {
        return { ...acc, [user.id]: user }
      }, {})
    }
  }, [usersList])

  const mappedUnitsList = useMemo(() => {
    if (unitsList) {
      return unitsList.reduce((acc, user) => {
        return { ...acc, [user.id]: user }
      }, {})
    }
  }, [unitsList])

  if (!mappedUsersList) return null

  if (!meetingsList.length) {
    return (
      <Typography
        color="text.secondary"
        align="center"
      >
        Brak spotkań. Utwórz pierwsze korzystając z przycisku w dolnym prawym rogu ekranu
      </Typography>
    )
  }

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePaginator pagination={pagination} />
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS_SETUP.map(({ name, label, allowSorting }) => (
                <TableCell key={name}>
                  {allowSorting ? (
                    <TableSortLabel
                      active={sortBy === name}
                      direction={sortDirection || 'asc'}
                      onClick={() => handleChangeSorting(name)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    label
                  )}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedUnitsList && mappedUsersList && (
              <>
                {handlePagination(tableData).map((meeting: Meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting.no}</TableCell>
                    <TableCell>{mappedUnitsList[meeting.unitId].name}</TableCell>
                    <TableCell>{meeting.contact}</TableCell>
                    <TableCell>{meeting.unitAgent || '-'}</TableCell>
                    <TableCell>{dayjs(meeting.date).format(DateTemplate.DDMMYYYY)}</TableCell>
                    <TableCell>{getFullName(mappedUsersList, meeting.handleById)}</TableCell>
                    <TableCell>
                      {meeting.details.slice(0, 80)}
                      {meeting.details.length > 80 ? '...' : ''}
                    </TableCell>
                    <TableCell>
                      <Link href={`/preview/meeting/${meeting.id}`}>
                        <IconButton size="small">
                          <Info />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
