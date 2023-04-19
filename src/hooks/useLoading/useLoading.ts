import { useDispatch, useSelector } from 'react-redux'
import { commonActions, commonSelectors } from '@src/store'

export const useLoading = () => {
  const dispatch = useDispatch()
  const state = useSelector(commonSelectors.selectIsLoading)

  const isLoading = (name) => {
    return state[name]
  }

  const setLoading = (name, state) => {
    dispatch(commonActions.setIsLoading({ isLoading: state, name }))
  }

  return {
    isLoading,
    setLoading,
  }
}
