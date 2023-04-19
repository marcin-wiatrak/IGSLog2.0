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
  Tooltip,
  Typography,
} from '@mui/material'
import { FC, useCallback, useMemo, useState } from 'react'
import { Return, User } from '@prisma/client'
import { ReturnContent, TableOrderDirection } from '@src/types'
import { getFullName, renameDownloadFile } from '@src/utils'
import { AssignUserModal, StatusSelector, UploadFileModal } from '@components/Orders'
import { LocalizationModal } from '@components/LocalizationModal'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import {
  customersSelectors,
  ordersActions,
  ordersSelectors,
  returnsActions,
  returnsSelectors,
  usersSelectors,
} from '@src/store'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetReturnsList } from '@src/hooks'
import * as R from 'ramda'
import { usePagination } from '@src/hooks/usePagination'
import { TablePaginator } from '@components/TablePaginator'
import { AddCircle, AttachFile, Description, Download, Info, Inventory } from '@mui/icons-material'
import { TypeElement } from '@components/TypeElement'
import { formatFullName } from '@src/utils/textFormatter'

const COLUMNS_SETUP = [
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
    label: 'IGS',
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
    name: 'returnAt',
    label: 'Data zwrotu',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'localization',
    label: 'Miejsce zwrotu',
    displayMobile: true,
    allowSorting: true,
  },
  {
    name: 'contained',
    label: 'Zawartość',
    displayMobile: true,
    allowSorting: false,
  },
  {
    name: 'handleBy',
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
  {
    name: 'attachment',
    label: 'Załączniki',
    displayMobile: true,
    allowSorting: false,
  },
]

export const ReturnsTable = () => {
  const { data } = useSession()
  const dispatch = useDispatch()
  const [attachmentsMenuAnchor, setAttachmentsMenuAnchor] = useState(null)
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const usersList = useSelector(usersSelectors.selectUsersList)
  const returnsList = useSelector(returnsSelectors.selectReturnsList)
  const returnDetails = useSelector(returnsSelectors.selectReturnDetails)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)
  const filters = useSelector(ordersSelectors.selectFilterRegisteredBy)
  // const [attachmentHover, setAttachmentHover] = useState('')

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<TableOrderDirection>('desc')

  const { refreshReturnsList } = useGetReturnsList()

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
    if (orderId) dispatch(returnsActions.setReturnDetails({ id: orderId }))
    onUploadFileModalOpen()
    setAttachmentsMenuAnchor(null)
  }

  const mappedCustomersList = useMemo(() => {
    if (customersList) {
      return customersList.reduce((acc, customer) => {
        return { ...acc, [customer.id]: customer }
      }, {})
    }
  }, [customersList])

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  const filterOrders = useCallback(
    (returns: Return[]) =>
      returns.filter(
        (ret) =>
          (filterByType.length ? filterByType.some((el) => ret.type.includes(el)) : true) &&
          (filters.registeredBy.length ? filters.registeredBy.some((el) => el.id === ret.registeredById) : true) &&
          (filters.handleBy.length ? filters.handleBy.some((el) => el.id === ret.handleById) : true) &&
          (filters.localization && (!!ret.localization || !ret.localization)
            ? ret.localization === null
              ? false
              : ret.localization.includes(filters.localization)
            : true) &&
          (filters.createdAtStart ? dayjs(ret.createdAt).isAfter(filters.createdAtStart) : true) &&
          (filters.createdAtEnd ? dayjs(ret.createdAt).isBefore(filters.createdAtEnd) : true)
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
    (returns) => {
      const sort =
        sortDirection === 'asc'
          ? R.sortWith([R.ascend(R.prop(sortBy) || '')])
          : R.sortWith([R.descend(R.prop(sortBy) || '')])
      return sort(returns)
    },
    [sortBy, sortDirection]
  )

  const dummyArray = new Array(8).fill('0').map((_, index) => {
    return index + 1
  })

  const handleAssignUserModalOpen = (orderId: string, handleById?: string) => {
    dispatch(returnsActions.setReturnDetails({ id: orderId, handleById }))
    onAssignUserModalOpen()
  }

  const handleAssignUserModalClose = () => {
    dispatch(returnsActions.clearReturnDetails())
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
      id = returnDetails.handleById
    }
    await axios.post(`/api/return/${orderId || returnDetails.id}/update`, { handleById: id }).then(() => {
      refreshReturnsList()
      handleAssignUserModalClose()
    })
  }

  const handleEditLocalizationModalOpen = (orderId: string, localization?: string) => {
    dispatch(returnsActions.setReturnDetails({ id: orderId, localization }))
    onLocalizationModalOpen()
  }

  const handleEditLocalizationModalClose = () => {
    dispatch(returnsActions.clearReturnDetails())
    onLocalizationModalClose()
  }

  const handleUpdateOrderLocalization = async () => {
    await axios
      .post(`/api/return/${returnDetails.id}/update`, { localization: returnDetails.localization })
      .then(() => {
        refreshReturnsList()
        handleEditLocalizationModalClose()
      })
  }

  const handleAttachmentsMenuClose = () => {
    dispatch(returnsActions.clearReturnDetails())
    setAttachmentsMenuAnchor(null)
  }

  // const handleAttachmentsMenuOpen = (e, attachments?: string[], orderId?: string) => {
  //   dispatch(returnsActions.setReturnDetails({ attachment: attachments, id: orderId }))
  //   setAttachmentsMenuAnchor(e.currentTarget)
  // }

  const tableData = useMemo(() => {
    return sortOrders(filterOrders(returnsList))
  }, [filterOrders, returnsList, sortOrders])

  const { handlePagination, ...pagination } = usePagination(tableData, 10)

  const formatContentToIcon = (content) => {
    switch (content) {
      case ReturnContent.DOC:
        return (
          <Tooltip title="Dokumentacja">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Description color="success" />
            </Box>
          </Tooltip>
        )
      case ReturnContent.MAT:
        return (
          <Tooltip title="Materiał">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Inventory color="warning" />
            </Box>
          </Tooltip>
        )
      case ReturnContent.MATDOC:
        return (
          <Tooltip title="Materiał + Dokumentacja">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Inventory color="warning" />
              <Description color="success" />
            </Box>
          </Tooltip>
        )
    }
  }

  if (!returnsList.length) {
    return (
      <Typography
        color="text.secondary"
        align="center"
      >
        Brak zwrotów. Utwórz pierwszy korzystając z przycisku w dolnym prawym rogu ekranu
      </Typography>
    )
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
            </TableRow>
          </TableHead>
          <TableBody>
            {returnsList ? (
              <>
                {handlePagination(tableData).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <TypeElement types={order.type} />
                    </TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.signature}</TableCell>
                    <TableCell>{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{order.returnAt ? dayjs(order.returnAt).format('DD/MM/YYYY') : '-'}</TableCell>
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
                        <Link onClick={() => handleEditLocalizationModalOpen(order.id)}>Edytuj</Link>
                      )}
                    </TableCell>
                    <TableCell>{formatContentToIcon(order.content)}</TableCell>
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
                      {/*  <IconButton*/}
                      {/*    onMouseEnter={() => setAttachmentHover(order.id)}*/}
                      {/*    onMouseLeave={() => setAttachmentHover('')}*/}
                      {/*    onClick={(e) =>*/}
                      {/*      !!order.attachment.length*/}
                      {/*        ? handleAttachmentsMenuOpen(e, order.attachment, order.id)*/}
                      {/*        : handleUploadFileModalOpen(order.id)*/}
                      {/*    }*/}
                      {/*  >*/}
                      {/*    <Badge*/}
                      {/*      badgeContent={order.attachment.length > 1 ? order.attachment.length : undefined}*/}
                      {/*      color="primary"*/}
                      {/*    >*/}
                      {/*      {attachmentHover === order.id && !order.attachment.length ? (*/}
                      {/*        <AddCircle />*/}
                      {/*      ) : (*/}
                      {/*        <AttachFile color={order.attachment.length ? 'error' : undefined} />*/}
                      {/*      )}*/}
                      {/*    </Badge>*/}
                      {/*  </IconButton>*/}
                      <Link href={`/preview/return/${order.id}`}>
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
        {returnDetails.attachment?.map((att) => (
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
