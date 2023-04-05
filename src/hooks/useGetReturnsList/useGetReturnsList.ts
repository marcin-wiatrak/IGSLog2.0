import axios from 'axios'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { returnsActions, returnsSelectors } from '@src/store'

export const useGetReturnsList = () => {
  const returnsList = useSelector(returnsSelectors.selectReturnsList)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const getReturnsList = useCallback(() => {
    const returnsListQuery = async () => await axios.get('/api/return/list')
    setIsLoading(true)
    returnsListQuery().then((res) => {
      dispatch(returnsActions.setReturnsList({ returnsList: res.data }))
      setIsLoading(false)
    })
  }, [])

  return {
    isLoading,
    returnsList: returnsList,
    refreshReturnsList: getReturnsList,
  }
}
