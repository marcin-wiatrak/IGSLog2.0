import { CurrentPath } from '@src/types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { commonActions } from '@src/store'

export const usePath = (path: CurrentPath) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(commonActions.setCurrentPath({ currentPath: path }))
  }, [])
}
