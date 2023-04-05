import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { getFullName, renameDownloadFile } from '@src/utils'
import { AssignUserModal, StatusSelector, UploadFileModal } from '@components/Orders'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { customersSelectors, ordersActions, ordersSelectors } from '@src/store'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetOrdersList } from '@src/hooks'
import * as R from 'ramda'
import { usePagination } from '@src/hooks/usePagination'
import { TablePaginator } from '@components/TablePaginator'
import { AddCircle, AttachFile, Download } from '@mui/icons-material'
import { LocalizationModal } from '@components/LocalizationModal'

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
  const [attachmentsMenuAnchor, setAttachmentsMenuAnchor] = useState(null)
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const ordersList = useSelector(ordersSelectors.selectOrdersList)
  const orderDetails = useSelector(ordersSelectors.selectOrderDetails)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)
  const filters = useSelector(ordersSelectors.selectFilterRegisteredBy)
  const [attachmentHover, setAttachmentHover] = useState('')

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const { refreshOrdersList } = useGetOrdersList()

  const {
    isOpen: isAssignUserModalOpen,
    onClose: onAssignUserModalClose,
    onOpen: onAssignUserModalOpen,
  } = useDisclose()

  const {
    isOpen: isLocalizationModalOpen,
    onClose: onLocalizationModalClose,
    onOpen: onLocalizationModalOpen,
  } = useDisclose()

  const {
    isOpen: isUploadFileModalOpen,
    onOpen: onUploadFileModalOpen,
    onClose: onUploadFileModalClose,
  } = useDisclose()

  const handleUploadFileModalOpen = (orderId?) => {
    if (orderId) dispatch(ordersActions.setOrderDetails({ id: orderId }))
    onUploadFileModalOpen()
    setAttachmentsMenuAnchor(null)
  }

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

  const handleAssignUserModalOpen = (orderId: string, handleById?: string) => {
    dispatch(ordersActions.setOrderDetails({ id: orderId, handleById }))
    onAssignUserModalOpen()
  }
  const handleAssignUserModalClose = () => {
    dispatch(ordersActions.clearOrderDetails())
    onAssignUserModalClose()
  }
  const handleUpdateOrderHandleBy = async (
    {
      selectedUser,
      selfAssign,
    }: {
      selectedUser?: string
      selfAssign?: boolean
    },
    orderId?: string
  ) => {
    let id = null
    if (selfAssign) {
      id = data.user.userId
    }
    if (selectedUser) {
      id = orderDetails.handleById
    }
    await axios.post(`/api/order/${orderId || orderDetails.id}/update`, { handleById: id }).then(() => {
      refreshOrdersList()
      handleAssignUserModalClose()
    })
  }

  const handleEditLocalizationModalOpen = (orderId: string, localization?: string) => {
    dispatch(ordersActions.setOrderDetails({ id: orderId, localization }))
    onLocalizationModalOpen()
  }

  const handleEditLocalizationModalClose = () => {
    dispatch(ordersActions.clearOrderDetails())
    onLocalizationModalClose()
  }

  const handleUpdateOrderLocalization = async () => {
    await axios
      .post(`/api/order/${orderDetails.id}/localization`, { localization: orderDetails.localization })
      .then(() => {
        refreshOrdersList()
        handleEditLocalizationModalClose()
      })
  }

  const handleAttachmentsMenuClose = () => {
    dispatch(ordersActions.clearOrderDetails())
    setAttachmentsMenuAnchor(null)
  }

  const handleAttachmentsMenuOpen = (e, attachments?: string[], orderId?: string) => {
    dispatch(ordersActions.setOrderDetails({ attachment: attachments, id: orderId }))
    setAttachmentsMenuAnchor(e.currentTarget)
  }

  const tableData = useMemo(() => {
    return sortOrders(filterOrders(ordersList))
  }, [filterOrders, ordersList, sortOrders])

  const { handlePagination, ...pagination } = usePagination(tableData, 10)

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePaginator pagination={pagination} />
      </Box>
      <TableContainer>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
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
                    <TableCell>
                      <IconButton
                        onMouseEnter={() => setAttachmentHover(order.id)}
                        onMouseLeave={() => setAttachmentHover('')}
                        onClick={(e) =>
                          !!order.attachment.length
                            ? handleAttachmentsMenuOpen(e, order.attachment, order.id)
                            : handleUploadFileModalOpen(order.id)
                        }
                      >
                        <Badge
                          badgeContent={order.attachment.length > 1 ? order.attachment.length : undefined}
                          color="primary"
                        >
                          {attachmentHover === order.id && !order.attachment.length ? (
                            <AddCircle />
                          ) : (
                            <AttachFile color={order.attachment.length ? 'error' : undefined} />
                          )}
                        </Badge>
                      </IconButton>
                    </TableCell>
                    <TableCell>{mappedCustomersList[order.customerId].name}</TableCell>
                    <TableCell>{order.signature}</TableCell>
                    <TableCell>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{order.pickupAt ? dayjs(order.pickupAt).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>
                    <TableCell>
                      {order.localization ? (
                        <Box
                          onClick={() => handleEditLocalizationModalOpen(order.id, order.localization)}
                          sx={{
                            display: 'inline',
                            cursor: 'pointer',
                            '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                          }}
                        >
                          {order.localization}
                        </Box>
                      ) : (
                        <Link onClick={() => handleEditLocalizationModalOpen(order.id)}>Edytuj</Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.handleById ? (
                        <Box
                          onClick={() => handleAssignUserModalOpen(order.id, order.handleById)}
                          sx={{
                            display: 'inline',
                            cursor: 'pointer',
                            '&:hover': { color: 'text.secondary' },
                          }}
                        >
                          {getFullName(mappedUsersList, order.handleById)}
                        </Box>
                      ) : (
                        <>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleAssignUserModalOpen(order.id)}
                          >
                            Przypisz
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="warning"
                            onClick={() => handleUpdateOrderHandleBy({ selfAssign: true }, order.id)}
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
      <Menu
        anchorEl={attachmentsMenuAnchor}
        open={!!attachmentsMenuAnchor}
        onClose={handleAttachmentsMenuClose}
      >
        {orderDetails.attachment?.map((att) => (
          <MenuItem key={att}>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText>
              <Link
                href={`/upload/${att}`}
                target="_blank"
                sx={{ textDecoration: 'none', color: 'text.primary' }}
                download={renameDownloadFile(att)}
              >
                {renameDownloadFile(att)}
              </Link>
            </ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => handleUploadFileModalOpen()}>
          <ListItemIcon>
            <AddCircle />
          </ListItemIcon>
          <ListItemText>Dodaj lub usuń załączniki</ListItemText>
        </MenuItem>
      </Menu>
      {isAssignUserModalOpen && (
        <AssignUserModal
          isOpen={isAssignUserModalOpen}
          onClose={handleAssignUserModalClose}
          onAssignUser={handleUpdateOrderHandleBy}
          onUnassignUser={handleUpdateOrderHandleBy}
        />
      )}
      {isLocalizationModalOpen && (
        <LocalizationModal
          isOpen={isLocalizationModalOpen}
          onClose={handleEditLocalizationModalClose}
          onConfirm={handleUpdateOrderLocalization}
        />
      )}
      {isUploadFileModalOpen && (
        <UploadFileModal
          isOpen={isUploadFileModalOpen}
          onClose={onUploadFileModalClose}
          method="updateOrder"
        />
      )}
    </>
  )
}
