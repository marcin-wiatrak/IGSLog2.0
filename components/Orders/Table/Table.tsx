import { Table as MuiTable, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { Customer, Order } from '@prisma/client'
import { TableOrderDirection } from '@src/types'

type TableProps = {
  data: Order[]
  customersList: Customer[]
}

const COLUMNS_SETUP = [
  {
    name: 'customer',
    label: 'Zleceniodawca',
  },
  {
    name: 'signature',
    label: 'Sygnatura',
  },
  {
    name: 'createdAt',
    label: 'Data utworzenia',
  },
  {
    name: 'pickupAt',
    label: 'Data odbioru',
  },
  {
    name: 'pickupFrom',
    label: 'Miejsce odbioru',
  },
  {
    name: 'handledBy',
    label: 'Osoba odpowiedzialna',
  },
  {
    name: 'registeredBy',
    label: 'Rejestrujący',
  },
  {
    name: 'status',
    label: 'Status',
  },
]

export const Table: FC<TableProps> = ({ data, customersList }) => {
  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const mappedCustomersList = useMemo(() => {
    if (customersList.length) {
      return customersList.reduce((acc, customer) => ({ ...acc, [customer.id]: customer }))
    }
  }, [customersList])

  const handleChangeSorting = (column) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  return (
    <MuiTable stickyHeader>
      <TableHead>
        <TableRow>
          {COLUMNS_SETUP.map(({ name, label }) => (
            <TableCell key={name}>
              <TableSortLabel
                active={sortBy === name}
                direction={sortDirection || 'asc'}
                onClick={() => handleChangeSorting(name)}
              >
                {label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{mappedCustomersList[order.customerId].name}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  )
}
