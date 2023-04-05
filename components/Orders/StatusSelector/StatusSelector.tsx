import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { OrderStatus, OrderStatuses, Paths, ReturnStatus, ReturnStatuses } from '@src/types'
import { ArrowDropDown } from '@mui/icons-material'
import axios from 'axios'
import { useGetOrdersList, useGetReturnsList } from '@src/hooks'
import { useSelector } from 'react-redux'
import { commonSelectors } from '@src/store'
import { orderStatusName, returnStatusName } from './StatusSelector.consts'

const ordersMenuOptions = [
  [OrderStatuses.NEW, 'Zarejestrowany'],
  [OrderStatuses.PICKED_UP, 'Odebrany'],
  [OrderStatuses.DELIVERED, 'Dostarczony'],
  [OrderStatuses.CLOSED, 'Zakończony'],
]

const returnsMenuOptions = [
  [ReturnStatuses.NEW, 'Zarejestrowany'],
  [ReturnStatuses.SET, 'Zwrot ustalony'],
  [ReturnStatuses.CLOSED, 'Zakończony'],
]

export const StatusSelector = ({ status, orderId }) => {
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
      .then((response) => {
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
        >
          {currentPath === Paths.ORDERS ? orderStatusName(status) : returnStatusName(status)}
        </Button>
        <Button
          size="small"
          onClick={handleStatusMenuOpen}
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
