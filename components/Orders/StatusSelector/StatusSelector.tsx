import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { OrderStatus, OrderStatuses, Paths, ReturnStatus, ReturnStatuses } from '@src/types'
import { ArrowDropDown } from '@mui/icons-material'
import axios from 'axios'
import { useGetOrdersList, useGetReturnsList } from '@src/hooks'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import { orderStatusName, returnStatusName } from './StatusSelector.consts'
import { green, grey } from '@mui/material/colors'
import { Order, Return } from '@prisma/client'

const ordersMenuOptions = [
  [OrderStatuses.NEW, 'Zarejestrowany'],
  [OrderStatuses.PICKED_UP, 'Odebrany'],
  [OrderStatuses.DELIVERED, 'Dostarczony'],
  [OrderStatuses.CLOSED, 'Zakończony'],
  [OrderStatuses.PAUSED, 'Wstrzymany'],
]

const returnsMenuOptions = [
  [ReturnStatuses.NEW, 'Zarejestrowany'],
  [ReturnStatuses.SET, 'Zwrot ustalony'],
  [ReturnStatuses.CLOSED, 'Zakończony'],
  [ReturnStatuses.PAUSED, 'Wstrzymany'],
]

type StatusSelectorProps = {
  status: Order['status'] | Return['status']
  orderId: string
}

const getStyle = (status) => {
  switch (status) {
    case ReturnStatuses.PAUSED:
    case OrderStatuses.PAUSED:
      return { color: grey[400], borderColor: grey[400] }
    case OrderStatuses.CLOSED:
    case ReturnStatuses.CLOSED:
      return {
        color: green[800],
        borderColor: green[800],
      }
    default:
      return undefined
  }
}

export const StatusSelector = ({ status, orderId }: StatusSelectorProps) => {
  const currentPath = useSelector(commonSelectors.selectCurrentPath)
  const { refreshOrdersList } = useGetOrdersList()
  const { refreshReturnsList } = useGetReturnsList()

  const [anchor, setAnchor] = useState(null)

  const handleStatusMenuOpen = (event) => {
    setAnchor(event.currentTarget)
  }

  const handleStatusMenuClose = () => setAnchor(null)

  const endpointPath = currentPath === Paths.ORDERS ? 'order' : 'return'

  const handleChangeStatus = async (status: OrderStatus | ReturnStatus) => {
    await axios
      .post(`/api/${endpointPath}/${orderId}/update`, { status })
      .then(() => {
        currentPath === Paths.ORDERS ? refreshOrdersList() : refreshReturnsList()
      })
      .catch((err) => {
        console.log(err)
      })
    handleStatusMenuClose()
  }

  const options = currentPath === Paths.ORDERS ? ordersMenuOptions : returnsMenuOptions

  return (
    <>
      <ButtonGroup
        variant="outlined"
        aria-label="split button"
      >
        <Button
          size="small"
          fullWidth
          sx={getStyle(status)}
        >
          {currentPath === Paths.ORDERS ? orderStatusName(status) : returnStatusName(status)}
        </Button>
        <Button
          size="small"
          onClick={handleStatusMenuOpen}
          variant="contained"
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Menu
        id="basic-menu"
        anchorEl={anchor}
        open={!!anchor}
        onClose={handleStatusMenuClose}
      >
        {options.map(([name, label]) => (
          <MenuItem
            onClick={() => handleChangeStatus(name as ReturnStatus | OrderStatus)}
            key={label}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
