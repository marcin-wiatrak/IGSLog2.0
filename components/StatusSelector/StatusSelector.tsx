import { IconButton, Stack, Tooltip } from '@mui/material'
import { OrderStatus, OrderStatuses, Paths, ReturnStatus, ReturnStatuses } from '@src/types'
import { CheckCircle, FiberNew, LocalShipping, NoteAdd, Outbound, Pause, Task } from '@mui/icons-material'
import axios from 'axios'
import { useGetOrdersList, useGetReturnsList } from '@src/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelectors, ordersActions, returnsActions } from '@src/store'
import { common, grey, pink } from '@mui/material/colors'
import { Order, Return } from '@prisma/client'
import { SnackbarFunctionProps, withSnackbar } from '@components/HOC'

type StatusSelectorProps = {
  status: Order['status'] | Return['status']
  orderId: string
  showSnackbar: (props: SnackbarFunctionProps) => void
}

const StatusSelectorComponent = ({ status, orderId, showSnackbar }: StatusSelectorProps) => {
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const dispatch = useDispatch()
  const { refreshOrdersList } = useGetOrdersList()
  const { refreshReturnsList } = useGetReturnsList()

  const endpointPath = currentPath === Paths.ORDERS ? 'order' : 'return'
  const isOrder = currentPath === Paths.ORDERS

  const handleChangeStatus = async (status: OrderStatus | ReturnStatus) => {
    isOrder
      ? dispatch(
          ordersActions.updateOrderStatus({
            orderId,
            status: status as OrderStatus,
          })
        )
      : dispatch(returnsActions.updateReturnStatus({ returnId: orderId, status: status as ReturnStatus }))
    await axios
      .post(`/api/${endpointPath}/${orderId}/update`, { status })
      .then(() => {
        showSnackbar({ message: 'Status zmieniony', severity: 'success' })
      })
      .catch(() => {
        showSnackbar({ message: 'Błąd zmiany statusu', severity: 'error' })
        currentPath === Paths.ORDERS ? refreshOrdersList() : refreshReturnsList()
      })
  }

  return (
    <>
      {isOrder ? (
        <Stack direction="row" justifyContent="center">
          <Tooltip
            title="Zarejestrowane"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === OrderStatuses.NEW ? undefined : handleChangeStatus(OrderStatuses.NEW))}
              sx={{
                backgroundColor: status === OrderStatuses.NEW ? 'primary.main' : undefined,
              }}
            >
              <FiberNew
                sx={{
                  color: status === OrderStatuses.NEW ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Ustalone"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() =>
                status === OrderStatuses.PICKED_UP ? undefined : handleChangeStatus(OrderStatuses.PICKED_UP)
              }
              sx={{
                backgroundColor: status === OrderStatuses.PICKED_UP ? 'warning.main' : undefined,
              }}
            >
              <Task
                sx={{
                  color: status === OrderStatuses.PICKED_UP ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Odebrane"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() =>
                status === OrderStatuses.DELIVERED ? undefined : handleChangeStatus(OrderStatuses.DELIVERED)
              }
              sx={{
                backgroundColor: status === OrderStatuses.DELIVERED ? pink[400] : undefined,
              }}
            >
              <Outbound
                sx={{
                  color: status === OrderStatuses.DELIVERED ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Zakończone"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === OrderStatuses.CLOSED ? undefined : handleChangeStatus(OrderStatuses.CLOSED))}
              sx={{
                backgroundColor: status === OrderStatuses.CLOSED ? 'success.main' : undefined,
              }}
            >
              <CheckCircle
                sx={{
                  color: status === OrderStatuses.CLOSED ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Wstrzymane"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === OrderStatuses.PAUSED ? undefined : handleChangeStatus(OrderStatuses.PAUSED))}
              sx={{
                backgroundColor: status === OrderStatuses.PAUSED ? 'error.main' : undefined,
              }}
            >
              <Pause
                sx={{
                  color: status === OrderStatuses.PAUSED ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="center">
          <Tooltip
            title="Zarejestrowane"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === ReturnStatuses.NEW ? undefined : handleChangeStatus(ReturnStatuses.NEW))}
              sx={{
                backgroundColor: status === ReturnStatuses.NEW ? 'primary.main' : undefined,
              }}
            >
              <FiberNew
                sx={{
                  color: status === ReturnStatuses.NEW ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Zwrot ustalony"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === ReturnStatuses.SET ? undefined : handleChangeStatus(ReturnStatuses.SET))}
              sx={{
                backgroundColor: status === ReturnStatuses.SET ? 'warning.main' : undefined,
              }}
            >
              <NoteAdd
                sx={{
                  color: status === ReturnStatuses.SET ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Zakończone"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === ReturnStatuses.CLOSED ? undefined : handleChangeStatus(ReturnStatuses.CLOSED))}
              sx={{
                backgroundColor: status === ReturnStatuses.CLOSED ? 'success.main' : undefined,
              }}
            >
              <CheckCircle
                sx={{
                  color: status === ReturnStatuses.CLOSED ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Wstrzymane"
            enterDelay={700}
            arrow
          >
            <IconButton
              size="small"
              onClick={() => (status === ReturnStatuses.PAUSED ? undefined : handleChangeStatus(ReturnStatuses.PAUSED))}
              sx={{
                backgroundColor: status === ReturnStatuses.PAUSED ? 'error.main' : undefined,
              }}
            >
              <Pause
                sx={{
                  color: status === ReturnStatuses.PAUSED ? common.white : grey[400],
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </>
  )
}

export const StatusSelector = withSnackbar(StatusSelectorComponent)
