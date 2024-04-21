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
  Typography,
} from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { Customer, Order } from '@prisma/client'
import { TableOrderDirection } from '@src/types'
import { renameDownloadFile } from '@src/utils'
import { AssignUserModal, StatusSelector, UploadFileModal } from '@components/Orders'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelectors, ordersActions, ordersSelectors } from '@src/store'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetOrdersList } from '@src/hooks'
import * as R from 'ramda'
import { usePagination } from '@src/hooks/usePagination'
import { TablePaginator } from '@components/TablePaginator'
import { AddCircle, AttachFile, Download, Info } from '@mui/icons-material'
import { formatFullName } from '@src/utils/textFormatter'
import { TypeElement } from '@components/TypeElement'
import { LocalizationModal, PickupAtModal } from '@components/modals'

const COLUMNS_SETUP = [
  {
    name: 'no',
    label: 'LP',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'type',
    label: 'Dział',
    displayMobile: true,
    allowSorting: false,
  },
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

export const OrdersTable = () => {
  const { data } = useSession()
  const dispatch = useDispatch()
  const [attachmentsMenuAnchor, setAttachmentsMenuAnchor] = useState(null)
  const orderDetails = useSelector(ordersSelectors.selectOrderDetails)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)
  const filters = useSelector(ordersSelectors.selectFilterRegisteredBy)
  const [attachmentHover, setAttachmentHover] = useState('')
  const findString = useSelector(commonSelectors.selectFindString)

  const [sortBy, setSortBy] = useState('no')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const { ordersList, refreshOrdersList } = useGetOrdersList()

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

  const { isOpen: isPickupAtModalOpen, onOpen: onPickupAtModalOpen, onClose: onPickupAtModalClose } = useDisclose()

  const handleUploadFileModalOpen = (orderId?) => {
    if (orderId) dispatch(ordersActions.setOrderDetails({ id: orderId }))
    onUploadFileModalOpen()
    setAttachmentsMenuAnchor(null)
  }

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const filterOrders = useCallback(
    (orders: (Order & { customer?: Customer })[]) =>
      orders.filter(
        (order) =>
          (filterByType.length ? filterByType.some((el) => order.type.includes(el)) : true) &&
          (filters.registeredBy.length ? filters.registeredBy.some((el) => el.id === order.registeredById) : true) &&
          (filters.handleBy.length ? filters.handleBy.some((el) => el.id === order.handleById) : true) &&
          (filters.status.length ? filters.status.includes(order.status) : true) &&
          (filters.localization && (!!order.localization || !order.localization)
            ? order.localization === null
              ? false
              : order.localization.includes(filters.localization)
            : true) &&
          (filters.createdAtStart ? dayjs(order.createdAt).isAfter(filters.createdAtStart) : true) &&
          (filters.createdAtEnd ? dayjs(order.createdAt).isBefore(filters.createdAtEnd) : true) &&
          (filters.pickupAtStart ? dayjs(order.pickupAt).isAfter(filters.pickupAtStart) : true) &&
          (filters.pickupAtEnd ? dayjs(order.pickupAt).isBefore(filters.pickupAtEnd) : true) &&
          ((findString ? order.localization?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? order.customer?.name?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? order.signature?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? order.no.toString().includes(findString.toLowerCase()) : true))
      ),
    [
      filterByType,
      filters.createdAtEnd,
      filters.createdAtStart,
      filters.handleBy,
      filters.localization,
      filters.registeredBy,
      filters.status,
      findString,
    ]
  )

  const sortOrders = useCallback(
    (orders) => {
      if (sortBy === 'pickupAt') {
        const isNull = R.pipe(R.prop(sortBy), R.isNil)
        const sort =
          sortDirection === 'asc'
            ? R.sortWith([R.ascend(R.pipe(isNull)), R.ascend(R.prop(sortBy))])
            : R.sortWith([R.descend(R.pipe(isNull, R.not)), R.descend(R.prop(sortBy))])
        return sort(orders)
      } else {
        const sort =
          sortDirection === 'asc'
            ? R.sortWith([R.ascend(R.prop('createdAt') || '')])
            : R.sortWith([R.descend(R.prop('createdAt') || '')])
        return sort(orders)
      }
    },
    [sortBy, sortDirection]
  )

  const dummyArray = new Array(8).fill('0').map((_, index) => {
    return index + 1
  })

  const handleClearOrderDetails = () => dispatch(ordersActions.clearOrderDetails())

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
    handleClearOrderDetails()
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
    handleClearOrderDetails()
    setAttachmentsMenuAnchor(null)
  }

  const handleAttachmentsMenuOpen = (e, attachments?: string[], orderId?: string) => {
    dispatch(ordersActions.setOrderDetails({ attachment: attachments, id: orderId }))
    setAttachmentsMenuAnchor(e.currentTarget)
  }

  const handlePickupAtModalOpen = (orderId: string, pickupAt?: string) => {
    dispatch(ordersActions.setOrderDetails({ id: orderId, pickupAt }))
    onPickupAtModalOpen()
  }

  const handleUpdatePickupAt = async () => {
    await axios.post(`/api/order/${orderDetails.id}/update`, { pickupAt: orderDetails.pickupAt }).then((res) => {
      onPickupAtModalClose()
      refreshOrdersList()
      handleClearOrderDetails()
    })
  }

  const tableData = useMemo(() => {
    return sortOrders(filterOrders(ordersList))
  }, [filterOrders, ordersList, sortOrders])

  const { handlePagination, ...pagination } = usePagination(tableData, 10)

  if (!ordersList.length) {
    return (
      <Typography
        color="text.secondary"
        align="center"
      >
        Brak odbiorów. Utwórz pierwszy korzystając z przycisku w dolnym prawym rogu ekranu
      </Typography>
    )
  }

  const handleClearPickupDate = async () => {
    await axios.post(`/api/order/${orderDetails.id}/update`, { pickupAt: null }).then((res) => {
      onPickupAtModalClose()
      refreshOrdersList()
      handleClearOrderDetails()
    })
  }

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePaginator pagination={pagination} />
      </Box>
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersList ? (
              <>
                {handlePagination(tableData).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.no}</TableCell>
                    <TableCell>
                      <TypeElement types={order.type} />
                    </TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.signature}</TableCell>
                    <TableCell>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>
                      {order.pickupAt ? (
                        <Box
                          onClick={() => handlePickupAtModalOpen(order.id, order.pickupAt)}
                          sx={{
                            display: 'inline',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                          }}
                        >
                          {dayjs(order.pickupAt).format('DD/MM/YYYY')}
                        </Box>
                      ) : (
                        <Button
                          onClick={() => handlePickupAtModalOpen(order.id)}
                          size="small"
                        >
                          Ustal
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.localization ? (
                        <Box
                          onClick={() => handleEditLocalizationModalOpen(order.id, order.localization)}
                          sx={{
                            display: 'inline',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                          }}
                        >
                          {order.localization}
                        </Box>
                      ) : (
                        <Button
                          onClick={() => handleEditLocalizationModalOpen(order.id)}
                          size="small"
                        >
                          Ustal
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.handleById ? (
                        <Box
                          onClick={() => handleAssignUserModalOpen(order.id, order.handleById)}
                          sx={{
                            display: 'inline',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { color: 'text.secondary' },
                          }}
                        >
                          {formatFullName(order.handleBy)}
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
                    <TableCell>{formatFullName(order.registeredBy)}</TableCell>
                    <TableCell>
                      <StatusSelector
                        status={order.status}
                        orderId={order.id}
                      />
                    </TableCell>
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
                      <Link href={`/preview/order/${order.id}`}>
                        <IconButton size="small">
                          <Info />
                        </IconButton>
                      </Link>
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
      {isPickupAtModalOpen && (
        <PickupAtModal
          isOpen={isPickupAtModalOpen}
          onClose={onPickupAtModalClose}
          onConfirm={handleUpdatePickupAt}
          onClearDate={handleClearPickupDate}
        />
      )}
    </>
  )
}
