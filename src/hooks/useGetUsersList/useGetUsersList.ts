import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { User } from '@prisma/client'

export const useGetUsersList = () => {
  const [usersList, setUsersList] = useState<User[]>([])
  const usersListQuery = async () => await axios.get('/api/user/list')

  const getUsersList = useCallback(() => {
    usersListQuery().then((res) => {
      setUsersList(res.data)
    })
  }, [])

  useEffect(() => {
    getUsersList()
  }, [getUsersList])

  return {
    usersList,
    refreshUsersList: getUsersList,
  }
}
