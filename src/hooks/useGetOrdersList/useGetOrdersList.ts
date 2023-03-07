import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Order } from '@prisma/client'

export const useGetOrdersList = () => {
  const [ordersList, setOrdersList] = useState<Order[]>([])
  const ordersListQuery = async () => await axios.get('/api/order/list')

  const getOrdersList = useCallback(() => {
    ordersListQuery().then((res) => {
      setOrdersList(res.data)
    })
  }, [])

  useEffect(() => {
    getOrdersList()
  }, [getOrdersList])

  return {
    ordersList: ordersList,
    refreshOrdersList: getOrdersList,
  }
}
