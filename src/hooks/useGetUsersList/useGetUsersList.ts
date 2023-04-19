import axios from 'axios'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usersActions, usersSelectors } from '@src/store'

export const useGetUsersList = () => {
  const usersList = useSelector(usersSelectors.selectUsersList)
  const dispatch = useDispatch()
  const usersListQuery = async () => await axios.get('/api/user/list')

  const getUsersList = useCallback(() => {
    usersListQuery().then((res) => {
      dispatch(usersActions.setUsersList({ usersList: res.data }))
    })
  }, [])

  useEffect(() => {
    if (!usersList.length) getUsersList()
  }, [getUsersList, usersList.length])

  return {
    usersList,
    refreshUsersList: getUsersList,
  }
}
