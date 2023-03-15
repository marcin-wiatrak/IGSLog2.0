import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ordersSelectors, ordersActions } from '@src/store'

export const useGetOrdersList = () => {
  const ordersList = useSelector(ordersSelectors.selectOrdersList)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const ordersListQuery = async () => await axios.get('/api/order/list')

  const getOrdersList = useCallback(() => {
    setIsLoading(true)
    ordersListQuery().then((res) => {
      dispatch(ordersActions.setOrdersList({ ordersList: res.data }))
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!ordersList.length) getOrdersList()
  }, [getOrdersList, ordersList.length])

  return {
    isLoading,
    ordersList: ordersList,
    refreshOrdersList: getOrdersList,
  }
}
