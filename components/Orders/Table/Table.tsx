import {
  Box,
  Button,
  Skeleton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import { FC, useCallback, useMemo, useState } from 'react'
import { Order, User } from '@prisma/client'
import { TableOrderDirection } from '@src/types'
import { getFullName } from '@src/utils'
import { StatusSelector } from '@components/Orders'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { customersSelectors, ordersActions, ordersSelectors } from '@src/store'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetOrdersList } from '@src/hooks'
import { AssignUserModal } from '@components/Orders/AssignUserModal'
import * as R from 'ramda'
import { usePagination } from '@src/hooks/usePagination'
import { TablePaginator } from '@components/TablePaginator'

type TableProps = {
  usersList: User[]
}

const COLUMNS_SETUP = [
  {
    name: 'customerId',
    label: 'Zleceniodawca',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'signature',
    label: 'Sygnatura',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'createdAt',
    label: 'Data utworzenia',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'pickupAt',
    label: 'Data odbioru',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'localization',
    label: 'Miejsce odbioru',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'handledBy',
    label: 'Osoba odpowiedzialna',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'registeredBy',
    label: 'Rejestrujący',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'status',
    label: 'Status',
    displayMobile: true,
    allowSorting: false,
  },
]

export const Table: FC<TableProps> = ({ usersList }) => {
  const { data } = useSession()
  const dispatch = useDispatch()
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const ordersList = useSelector(ordersSelectors.selectOrdersList)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)
  const filters = useSelector(ordersSelectors.selectFilterRegisteredBy)

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const { refreshOrdersList } = useGetOrdersList()

  const {
    isOpen: isAssignUserModalOpen,
    onClose: onAssignUserModalClose,
    onOpen: handleAssignUserModalOpen,
  } = useDisclose()

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

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const filterOrders = useCallback(
    (orders: Order[]) =>
      orders.filter(
        (order) =>
          (filterByType.length ? filterByType.some((el) => order.type.includes(el)) : true) &&
          (filters.registeredBy.length ? filters.registeredBy.some((el) => el.id === order.registeredById) : true) &&
          (filters.handleBy.length ? filters.handleBy.some((el) => el.id === order.handleById) : true) &&
          (filters.localization && (!!order.localization || !order.localization)
            ? order.localization === null
              ? false
              : order.localization.includes(filters.localization)
            : true) &&
          (filters.createdAtStart ? dayjs(order.createdAt).isAfter(filters.createdAtStart) : true) &&
          (filters.createdAtEnd ? dayjs(order.createdAt).isBefore(filters.createdAtEnd) : true)
      ),
    [
      filterByType,
      filters.createdAtEnd,
      filters.createdAtStart,
      filters.handleBy,
      filters.localization,
      filters.registeredBy,
    ]
  )

  const sortOrders = useCallback(
    (orders) => {
      const sort =
        sortDirection === 'asc'
          ? R.sortWith([R.ascend(R.prop(sortBy) || '')])
          : R.sortWith([R.descend(R.prop(sortBy) || '')])
      return sort(orders)
    },
    [sortBy, sortDirection]
  )

  const dummyArray = new Array(8).fill('0').map((_, index) => {
    return index + 1
  })

  const handleAssignUser = async (orderId: string, userId?: string) => {
    const id = userId || data.user.userId
    await axios.post(`/api/order/${orderId}/assign`, { handleById: id }).then(() => {
      refreshOrdersList()
      handleAssignUserModalClose()
    })
  }

  const handleUnassignUser = async (orderId: string) => {
    await axios.post(`/api/order/${orderId}/unassign`).then(() => {
      refreshOrdersList()
      handleAssignUserModalClose()
    })
  }

  const handleOpenAssignMenu = (orderId) => {
    dispatch(ordersActions.setCurrentOrderId({ currentOrderId: orderId }))
    handleAssignUserModalOpen()
  }

  const handleAssignUserModalClose = () => {
    dispatch(ordersActions.setCurrentOrderId({ currentOrderId: undefined }))
    onAssignUserModalClose()
  }

  const tableData = useMemo(() => {
    return sortOrders(filterOrders(ordersList))
  }, [filterOrders, ordersList, sortOrders])

  const { handlePagination, ...pagination } = usePagination(tableData, 10)

  return (
    <>
      <TableContainer>
        <MuiTable stickyHeader>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersList && !!ordersList.length && mappedCustomersList && mappedUsersList ? (
              <>
                {handlePagination(tableData).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{mappedCustomersList[order.customerId].name}</TableCell>
                    <TableCell>{order.signature}</TableCell>
                    <TableCell>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{order.pickupAt ? dayjs(order.pickupAt).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>
                    <TableCell>{order.localization}</TableCell>
                    <TableCell>
                      {order.handleById ? (
                        <Box
                          style={{ display: 'inline', cursor: 'pointer' }}
                          onClick={() => handleOpenAssignMenu(order.id)}
                        >
                          {getFullName(mappedUsersList, order.handleById)}
                        </Box>
                      ) : (
                        <>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleOpenAssignMenu(order.id)}
                          >
                            Przypisz
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="warning"
                            onClick={() => handleAssignUser(order.id)}
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
      </TableContainer>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePaginator pagination={pagination} />
      </Box>
      {isAssignUserModalOpen && (
        <AssignUserModal
          isOpen={isAssignUserModalOpen}
          onClose={handleAssignUserModalClose}
          onAssignUser={handleAssignUser}
          onUnassignUser={handleUnassignUser}
        />
      )}
    </>
  )
}
