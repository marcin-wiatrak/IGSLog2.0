import axios from 'axios'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { meetingsActions, meetingsSelectors } from '@src/store/meetings.slice'

export const useGetUnitsList = () => {
  const unitsList = useSelector(meetingsSelectors.selectUnitsList)
  const dispatch = useDispatch()
  const usersListQuery = async () => await axios.get('/api/unit/list')

  const getUnitsList = useCallback(() => {
    usersListQuery().then((res) => {
      dispatch(meetingsActions.setUnitsList({ unitsList: res.data }))
    })
  }, [])

  useEffect(() => {
    if (!unitsList) getUnitsList()
  }, [getUnitsList, unitsList])

  return {
    unitsList: unitsList,
    refreshUnitsList: getUnitsList,
  }
}
