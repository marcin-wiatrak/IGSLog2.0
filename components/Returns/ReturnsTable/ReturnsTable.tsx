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
  Stack,
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
import { useCallback, useMemo, useState } from 'react'
import { Customer, Return } from '@prisma/client'
import { ReturnContent, TableOrderDirection } from '@src/types'
import { renameDownloadFile } from '@src/utils'
import { AssignUserModal, StatusSelector, UploadFileModal } from '@components/Orders'
import { LocalizationModal } from 'components/modals/LocalizationModal'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelectors, customersSelectors, ordersSelectors, returnsActions, returnsSelectors } from '@src/store'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useDisclose, useGetReturnsList } from '@src/hooks'
import * as R from 'ramda'
import { usePagination } from '@src/hooks/usePagination'
import { TablePaginator } from '@components/TablePaginator'
import { AddCircle, AttachFile, Description, Download, Info, Inventory } from '@mui/icons-material'
import { TypeElement } from '@components/TypeElement'
import { formatFullName } from '@src/utils/textFormatter'
import { PickupAtModal } from '@components/modals/PickupAtModal'
import { SnackbarFunctionProps, withSnackbar } from '@components/HOC'

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
    name: 'contained',
    label: 'Zawartość',
    displayMobile: true,
    allowSorting: false,
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

type ReturnsTableProps = {
  showSnackbar: (props: SnackbarFunctionProps) => void
}

const ReturnsTableComponent = ({ showSnackbar }: ReturnsTableProps) => {
  const { data } = useSession()
  const dispatch = useDispatch()
  const [attachmentsMenuAnchor, setAttachmentsMenuAnchor] = useState(null)
  const [attachmentHover, setAttachmentHover] = useState('')
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const findString = useSelector(commonSelectors.selectFindString)
  const returnsList = useSelector(returnsSelectors.selectReturnsList)
  const returnDetails = useSelector(returnsSelectors.selectReturnDetails)
  const filterByType = useSelector(ordersSelectors.selectFilterByType)
  const filters = useSelector(returnsSelectors.selectFilters)
  // const [attachmentHover, setAttachmentHover] = useState('')

  const [sortBy, setSortBy] = useState('no')
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

  const { isOpen: isPickupAtModalOpen, onOpen: onPickupAtModalOpen, onClose: onPickupAtModalClose } = useDisclose()

  const handleUploadFileModalOpen = (orderId?) => {
    if (orderId) dispatch(returnsActions.setReturnDetails({ id: orderId }))
    onUploadFileModalOpen()
    setAttachmentsMenuAnchor(null)
  }

  const handleChangeSorting = (column: string) => {
    setSortBy(column)
    setSortDirection((prevState) => (prevState === 'desc' ? 'asc' : 'desc'))
  }

  console.log(filterByType, filterByType.length)

  const filterOrders = useCallback(
    (returns: (Return & { customer?: Customer })[]) =>
      returns.filter(
        (ret) =>
          (filterByType.length ? filterByType.some((el) => ret.type.includes(el)) : true) &&
          (filters.registeredBy.length ? filters.registeredBy.some((el) => el.id === ret.registeredById) : true) &&
          (filters.handleBy.length ? filters.handleBy.some((el) => el.id === ret.handleById || el.id === ret.handleByMaterialId) : true) &&
          (filters.status.length ? filters.status.includes(ret.status) : true) &&
          (filters.localization ? (ret.localization?.toLowerCase().includes(filters.localization.toLowerCase()) || ret.localizationMaterial?.toLowerCase().includes(filters.localization.toLowerCase())) : true) &&
          (filters.createdAtStart ? dayjs(ret.createdAt).isAfter(filters.createdAtStart) : true) &&
          (filters.createdAtEnd ? dayjs(ret.createdAt).isBefore(filters.createdAtEnd) : true) &&
          (filters.returnAtStart ? (dayjs(ret.returnAt).isAfter(filters.returnAtStart) || dayjs(ret.returnAtMaterial).isAfter(filters.returnAtStart)) : true) &&
          (filters.returnAtEnd ? (dayjs(ret.returnAt).isBefore(filters.returnAtEnd) || dayjs(ret.returnAtMaterial).isBefore(filters.returnAtEnd)) : true) &&
          ((findString ? ret.localization?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? ret.customer?.name?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? ret.signature?.toLowerCase().includes(findString.toLowerCase()) : true) ||
            (findString ? ret.no.toString().includes(findString.toLowerCase()) : true))
      ),
    [
      filterByType,
      filters.createdAtEnd,
      filters.createdAtStart,
      filters.returnAtStart,
      filters.returnAtEnd,
      filters.handleBy,
      filters.localization,
      filters.registeredBy,
      filters.status,
      findString,
    ]
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

  const dummyArray = new Array(8).fill('0').map((_, index) => {
    return index + 1
  })

  const handleAssignUserModalOpen = (
    orderId: string,
    handleById?: string,
    handleByMaterialId?: string,
    content?: string
  ) => {
    dispatch(returnsActions.setReturnDetails({ id: orderId, handleById, handleByMaterialId, content }))
    onAssignUserModalOpen()
  }

  const handleAssignUserModalClose = () => {
    handleClearReturnDetails()
    onAssignUserModalClose()
  }

  const handleUpdateOrderHandleBy = async (
    {
      selectedUser,
      selfAssign,
      returnContent,
    }: {
      selectedUser?: string
      selfAssign?: boolean
      returnContent?: string
    },
    orderId?: string
  ) => {
    let id = null
    if (selfAssign) {
      id = data.user.userId
    }
    if (selectedUser) {
      id = returnDetails.handleById || returnDetails.handleByMaterialId
    }

    const payloadReturn = returnContent === 'DOC' ? { handleById: id } : { handleByMaterialId: id }
    await axios
      .post(`/api/return/${orderId || returnDetails.id}/update`, returnContent ? payloadReturn : { handleById: id })
      .then(() => {
        refreshReturnsList()
        handleAssignUserModalClose()
      })
  }

  const handleClearReturnDetails = () => dispatch(returnsActions.clearReturnDetails())

  const handleEditLocalizationModalOpen = (
    orderId: string,
    localization?: string,
    localizationMaterial?: string,
    content?: string
  ) => {
    dispatch(returnsActions.setReturnDetails({ id: orderId, localization, localizationMaterial, content }))
    onLocalizationModalOpen()
  }

  const handleEditLocalizationModalClose = () => {
    handleClearReturnDetails()
    onLocalizationModalClose()
  }

  const handleUpdateOrderLocalization = async () => {
    const payload = {
      localization: returnDetails.localization || undefined,
      localizationMaterial: returnDetails.localizationMaterial || undefined,
    }
    await axios.post(`/api/return/${returnDetails.id}/update`, payload).then(() => {
      refreshReturnsList()
      handleEditLocalizationModalClose()
    })
  }

  const handleAttachmentsMenuClose = () => {
    handleClearReturnDetails()
    setAttachmentsMenuAnchor(null)
  }

  const handleAttachmentsMenuOpen = (e, attachments?: string[], orderId?: string) => {
    dispatch(returnsActions.setReturnDetails({ attachment: attachments, id: orderId }))
    setAttachmentsMenuAnchor(e.currentTarget)
  }

  const handleReturnAtModalOpen = (
    returnId: string,
    returnAt?: string,
    returnAtMaterial?: string,
    content?: string
  ) => {
    dispatch(returnsActions.setReturnDetails({ id: returnId, returnAt, returnAtMaterial, content }))
    onPickupAtModalOpen()
  }

  const handleUpdateReturnAt = async () => {
    const payload = {
      returnAt: returnDetails.returnAt || undefined,
      returnAtMaterial: returnDetails.returnAtMaterial || undefined,
    }
    await axios.post(`/api/return/${returnDetails.id}/update`, payload).then(() => {
      showSnackbar({ message: 'Data zwrotu zmieniona', severity: 'success' })
      onPickupAtModalClose()
      refreshReturnsList()
      handleClearReturnDetails()
    })
  }

  const handleClearReturnAtDate = async () => {
    const payload = {
      returnAt: returnDetails.returnAt ? null : undefined,
      returnAtMaterial: returnDetails.returnAtMaterial ? null : undefined,
    }
    await axios.post(`/api/return/${returnDetails.id}/update`, payload).then(() => {
      onPickupAtModalClose()
      refreshReturnsList()
      handleClearReturnDetails()
    })
  }

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

  const checkReturnContent = (content, variant) => !!content.includes(variant)

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
                {handlePagination(tableData).map((ret, index) => (
                  <TableRow
                    key={ret.id}
                    style={index % 2 ? { backgroundColor: 'rgba(0, 0, 0, 0.03)' } : undefined}
                  >
                    <TableCell>{ret.no}</TableCell>
                    <TableCell>
                      <TypeElement types={ret.type} />
                    </TableCell>
                    <TableCell>{ret.customer.name}</TableCell>
                    <TableCell>{ret.signature}</TableCell>
                    <TableCell>{dayjs(ret.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell
                      padding="none"
                      sx={{ padding: 0 }}
                    >
                      <Stack
                        spacing={1}
                        divider={
                          <Divider
                            orientation="horizontal"
                            flexItem
                          />
                        }
                        flex={1}
                      >
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Dokumentacja">
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Description
                                color={checkReturnContent(ret.content, ReturnContent.DOC) ? 'success' : 'disabled'}
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Materiał">
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Inventory
                                color={checkReturnContent(ret.content, ReturnContent.MAT) ? 'warning' : 'disabled'}
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{ padding: 0 }}
                    >
                      <Stack
                        spacing={1}
                        divider={
                          <Divider
                            orientation="horizontal"
                            flexItem
                          />
                        }
                        flex={1}
                      >
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.DOC) ? (
                            ret.returnAt ? (
                              <Box
                                onClick={() => handleReturnAtModalOpen(ret.id, ret.returnAt, undefined, 'DOC')}
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                                }}
                              >
                                {dayjs(ret.returnAt).format('DD/MM/YYYY')}
                              </Box>
                            ) : (
                              <Button
                                onClick={() => handleReturnAtModalOpen(ret.id, undefined, undefined, 'DOC')}
                                size="small"
                              >
                                Ustal
                              </Button>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.MAT) ? (
                            ret.returnAtMaterial ? (
                              <Box
                                onClick={() => handleReturnAtModalOpen(ret.id, undefined, ret.returnAtMaterial, 'MAT')}
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                                }}
                              >
                                {dayjs(ret.returnAtMaterial).format('DD/MM/YYYY')}
                              </Box>
                            ) : (
                              <Button
                                onClick={() => handleReturnAtModalOpen(ret.id, undefined, undefined, 'MAT')}
                                size="small"
                              >
                                Ustal
                              </Button>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{ padding: 0, paddingY: 1 }}
                    >
                      <Stack
                        spacing={1}
                        divider={
                          <Divider
                            orientation="horizontal"
                            flexItem
                          />
                        }
                        flex={1}
                      >
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.DOC) ? (
                            ret.localization ? (
                              <Box
                                onClick={() =>
                                  handleEditLocalizationModalOpen(ret.id, ret.localization, undefined, 'DOC')
                                }
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                                }}
                              >
                                {ret.localization}
                              </Box>
                            ) : (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleEditLocalizationModalOpen(ret.id, undefined, undefined, 'DOC')}
                              >
                                Edytuj
                              </Button>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.MAT) ? (
                            ret.localizationMaterial ? (
                              <Box
                                onClick={() =>
                                  handleEditLocalizationModalOpen(ret.id, undefined, ret.localizationMaterial)
                                }
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary', cursor: 'pointer' },
                                }}
                              >
                                {ret.localizationMaterial}
                              </Box>
                            ) : (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleEditLocalizationModalOpen(ret.id, undefined, undefined, 'MAT')}
                              >
                                Edytuj
                              </Button>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{ padding: 0 }}
                    >
                      <Stack
                        spacing={1}
                        divider={
                          <Divider
                            orientation="horizontal"
                            flexItem
                          />
                        }
                        flex={1}
                      >
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.DOC) ? (
                            ret.handleById ? (
                              <Box
                                onClick={() => handleAssignUserModalOpen(ret.id, ret.handleById, undefined, 'DOC')}
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary' },
                                }}
                              >
                                {formatFullName(ret.handleBy)}
                              </Box>
                            ) : (
                              <>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => handleAssignUserModalOpen(ret.id, undefined, undefined, 'DOC')}
                                >
                                  Przypisz
                                </Button>
                                <Button
                                  variant="text"
                                  size="small"
                                  color="warning"
                                  onClick={() =>
                                    handleUpdateOrderHandleBy(
                                      {
                                        selfAssign: true,
                                        returnContent: 'DOC',
                                      },
                                      ret.id
                                    )
                                  }
                                >
                                  Do mnie
                                </Button>
                              </>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                        <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {checkReturnContent(ret.content, ReturnContent.MAT) ? (
                            ret.handleByMaterialId ? (
                              <Box
                                onClick={() =>
                                  handleAssignUserModalOpen(ret.id, undefined, ret.handleByMaterialId, 'MAT')
                                }
                                sx={{
                                  display: 'inline',
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { color: 'text.secondary' },
                                }}
                              >
                                {formatFullName(ret.handleByMaterial)}
                              </Box>
                            ) : (
                              <>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => handleAssignUserModalOpen(ret.id, undefined, undefined, 'MAT')}
                                >
                                  Przypisz
                                </Button>
                                <Button
                                  variant="text"
                                  size="small"
                                  color="warning"
                                  onClick={() =>
                                    handleUpdateOrderHandleBy(
                                      {
                                        selfAssign: true,
                                        returnContent: 'MAT',
                                      },
                                      ret.id
                                    )
                                  }
                                >
                                  Do mnie
                                </Button>
                              </>
                            )
                          ) : (
                            '-'
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{formatFullName(ret.registeredBy)}</TableCell>
                    <TableCell style={{ padding: 0 }}>
                      <StatusSelector
                        status={ret.status}
                        orderId={ret.id}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onMouseEnter={() => setAttachmentHover(ret.id)}
                        onMouseLeave={() => setAttachmentHover('')}
                        onClick={(e) =>
                          !!ret.attachment.length
                            ? handleAttachmentsMenuOpen(e, ret.attachment, ret.id)
                            : handleUploadFileModalOpen(ret.id)
                        }
                      >
                        <Badge
                          badgeContent={ret.attachment.length > 1 ? ret.attachment.length : undefined}
                          color="primary"
                        >
                          {attachmentHover === ret.id && !ret.attachment.length ? (
                            <AddCircle />
                          ) : (
                            <AttachFile color={ret.attachment.length ? 'error' : undefined} />
                          )}
                        </Badge>
                      </IconButton>
                      <Link href={`/preview/return/${ret.id}`}>
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
      {isPickupAtModalOpen && (
        <PickupAtModal
          isOpen={isPickupAtModalOpen}
          onClose={onPickupAtModalClose}
          onConfirm={handleUpdateReturnAt}
          onClearDate={handleClearReturnAtDate}
        />
      )}
    </>
  )
}

export const ReturnsTable = withSnackbar(ReturnsTableComponent)
