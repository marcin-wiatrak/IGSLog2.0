import {
  Button,
  Skeleton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { User } from '@prisma/client'
import { TableOrderDirection } from '@src/types'
import { getFullName } from '@src/utils'
import { StatusSelector } from '@components/Orders'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { customersSelectors, ordersSelectors } from '@src/store'

type TableProps = {
  usersList: User[]
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

export const Table: FC<TableProps> = ({ usersList }) => {
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const ordersList = useSelector(ordersSelectors.selectOrdersList)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)

  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const mappedCustomersList = useMemo(() => {
    if (customersList.length) {
      return customersList.reduce((acc, customer) => {
        return { ...acc, [customer.id]: customer }
      }, {})
    }
  }, [customersList])

  const mappedUsersList = useMemo(() => {
    if (usersList.length) {
      return usersList.reduce((acc, customer) => {
        return { ...acc, [customer.id]: customer }
      }, {})
    }
  }, [usersList])

  const handleChangeSorting = (column) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const filterOrders = (orders) =>
    orders.filter((order) => {
      return filterByType.length ? filterByType.some((el) => order.type.includes(el)) : true
    })

  const dummyArray = new Array(8).fill('0').map((_, index) => {
    return index + 1
  })

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
        {ordersList && !!ordersList.length && mappedCustomersList && mappedUsersList ? (
          <>
            {filterOrders(ordersList).map((order) => (
              <TableRow key={order.id}>
                <TableCell>{mappedCustomersList[order.customerId].name}</TableCell>
                <TableCell>{order.signature}</TableCell>
                <TableCell>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                <TableCell>{order.pickupAt}</TableCell>
                <TableCell>{order.localization}</TableCell>
                <TableCell>
                  {order.handleById ? (
                    getFullName(mappedUsersList, order.handleById)
                  ) : (
                    <>
                      <Button
                        variant="text"
                        size="small"
                      >
                        Przypisz
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="warning"
                      >
                        Do mnie
                      </Button>
                    </>
                  )}
                </TableCell>
                <TableCell>{getFullName(mappedUsersList, order.registeredById)}</TableCell>
                <TableCell>
                  <StatusSelector
                    status={order.status}
                    orderId={order.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          <>
            {dummyArray.map((el) => (
              <TableRow key={el}>
                <TableCell colSpan={COLUMNS_SETUP.length}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="30px"
                  />
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </MuiTable>
  )
}
