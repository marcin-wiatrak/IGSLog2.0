import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { returnsActions, returnsSelectors } from '@src/store'

export const useGetReturnsList = () => {
  const returnsList = useSelector(returnsSelectors.selectReturnsList)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const returnsListQuery = async () => await axios.get('/api/return/list')

  const getReturnsList = useCallback(() => {
    setIsLoading(true)
    returnsListQuery().then((res) => {
      dispatch(returnsActions.setReturnsList({ returnsList: res.data }))
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!returnsList.length) getReturnsList()
  }, [getReturnsList, returnsList.length])

  return {
    isLoading,
    returnsList: returnsList,
    refreshReturnsList: getReturnsList,
  }
}
