import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import { useMemo, useState } from 'react'
import { OrderStatus, OrderStatuses } from '@src/types'
import { ArrowDropDown } from '@mui/icons-material'
import axios from 'axios'
import { useGetOrdersList } from '@src/hooks'

export const StatusSelector = ({ status, orderId }) => {
  const { refreshOrdersList } = useGetOrdersList()

  const [anchor, setAnchor] = useState(null)

  const statusName = useMemo(() => {
    switch (status) {
      case OrderStatuses.NEW:
        return 'Zarejestrowane'
      case OrderStatuses.PICKED_UP:
        return 'Odebrane'
      case OrderStatuses.DELIVERED:
        return 'Dostarczone'
      case OrderStatuses.CLOSED:
        return 'Zakończone'
    }
  }, [status])

  const handleStatusMenuOpen = (event) => {
    setAnchor(event.currentTarget)
  }

  const handleStatusMenuClose = () => setAnchor(null)

  const handleChangeStatus = async (status: OrderStatus) => {
    await axios.post(`/api/order/${orderId}/status`, { status }).then((response) => {
      refreshOrdersList()
    }).catch((err) => {
      console.log(err)
    })
    handleStatusMenuClose()
  }

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
          {statusName}
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
        <MenuItem onClick={() => handleChangeStatus(OrderStatuses.NEW)}>Zarejestrowany</MenuItem>
        <MenuItem onClick={() => handleChangeStatus(OrderStatuses.PICKED_UP)}>Odebrany</MenuItem>
        <MenuItem onClick={() => handleChangeStatus(OrderStatuses.DELIVERED)}>Dostarczony</MenuItem>
        <MenuItem onClick={() => handleChangeStatus(OrderStatuses.CLOSED)}>Zakończony</MenuItem>
      </Menu>
    </>
  )
}
