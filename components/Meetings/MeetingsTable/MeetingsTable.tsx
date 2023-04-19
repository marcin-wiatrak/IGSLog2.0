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
import { useEffect, useMemo, useState } from 'react'
import { useGetMeetingsList } from '@src/hooks/useGetMeetingsList'
import { TableOrderDirection } from '@src/types'
import { useSelector } from 'react-redux'
import { usersSelectors } from '@src/store'
import dayjs from 'dayjs'
import { DateTimeTemplate, getFullName } from '@src/utils'
import { useGetUsersList } from '@src/hooks'
import { useGetUnitsList } from '@src/hooks/useGetUnitsList/useGetUnitsList'
import { Info } from '@mui/icons-material'
import Link from 'next/link'

const COLUMNS_SETUP = [
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
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')
  const { getMeetingsList, meetingsList } = useGetMeetingsList()
  const { unitsList } = useGetUnitsList()

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const tableData = useMemo(() => {
    return meetingsList
  }, [meetingsList])

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
                {tableData?.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{mappedUnitsList[meeting.unitId].name}</TableCell>
                    <TableCell>{meeting.contact}</TableCell>
                    <TableCell>{meeting.unitAgent || '-'}</TableCell>
                    <TableCell>{dayjs(meeting.date).format(DateTimeTemplate.DDMMYYYYHHmm)}</TableCell>
                    <TableCell>{getFullName(mappedUsersList, meeting.handleById)}</TableCell>
                    <TableCell>{meeting.details}</TableCell>
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
