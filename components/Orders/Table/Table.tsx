import { Table as MuiTable, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { FC, useState } from 'react'
import { Orders } from '@prisma/client'
import { TableOrderDirection } from '@src/types'

type TableProps = {
  data: Orders[]
}

const COLUMNS_SETUP = [{}]

export const Table: FC<TableProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const handleChangeSorting = (column) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  return (
    <MuiTable stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              active={sortBy === 'id'}
              direction={sortBy === 'id' ? sortDirection : null}
              onClick={() => handleChangeSorting('id')}
            >
              ID
            </TableSortLabel>
          </TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  )
}
