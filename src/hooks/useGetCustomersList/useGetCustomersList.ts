import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Customer } from '@prisma/client'

export const useGetCustomersList = () => {
  const [customersList, setCustomersList] = useState<Customer[]>([])
  const customersListQuery = async () => await axios.get('/api/customer/list')

  const getCustomersList = useCallback(() => {
    customersListQuery().then((res) => {
      setCustomersList(res.data)
    })
  }, [])

  useEffect(() => {
    getCustomersList()
  }, [getCustomersList])

  return {
    customersList,
    onRefreshCustomersList: getCustomersList,
  }
}
