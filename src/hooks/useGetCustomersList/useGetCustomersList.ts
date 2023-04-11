import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { customersActions, customersSelectors } from '@src/store'

export const useGetCustomersList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const customersListQuery = async () => await axios.get('/api/customer/list')
  const customersList = useSelector(customersSelectors.selectCustomersList)
  const dispatch = useDispatch()

  const getCustomersList = useCallback(() => {
    setIsLoading(true)
    customersListQuery().then((res) => {
      dispatch(customersActions.setCustomersList({ customersList: res.data }))
      setIsLoading(false)
    })
  }, [dispatch])

  useEffect(() => {
    !customersList && getCustomersList()
  }, [customersList, getCustomersList])

  return {
    isLoading,
    customersList,
    refreshCustomersList: getCustomersList,
    getCustomersList,
  }
}
