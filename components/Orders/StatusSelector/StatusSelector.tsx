import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { OrderStatus, OrderStatuses } from '@src/types'
import { ArrowDropDown } from '@mui/icons-material'
import axios from 'axios'

export const StatusSelector = ({ status, orderId }) => {
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
    await axios.post(`/api/order/${orderId}/stat`, { status: status })
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
        <MenuItem onClick={handleStatusMenuClose}>Zarejestrowany</MenuItem>
        <MenuItem onClick={handleStatusMenuClose}>Odebrany</MenuItem>
        <MenuItem onClick={handleStatusMenuClose}>Dostarczony</MenuItem>
        <MenuItem onClick={() => handleChangeStatus(OrderStatuses.CLOSED)}>Zakończony</MenuItem>
      </Menu>
    </>
  )
}
