import axios from 'axios'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'

export const useGetOrdersList = () => {
  const ordersList = useSelector(ordersSelectors.selectOrdersList)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const getOrdersList = useCallback(() => {
    const ordersListQuery = async () => await axios.get('/api/order/list')
    setIsLoading(true)
    ordersListQuery().then((res) => {
      dispatch(ordersActions.setOrdersList({ ordersList: res.data }))
      setIsLoading(false)
    })
  }, [])

  return {
    isLoading,
    ordersList: ordersList,
    refreshOrdersList: getOrdersList,
  }
}
