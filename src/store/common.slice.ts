import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { CurrentPath } from '@src/types'

type IsLoadingType = {
  [name: string]: boolean
}

export type CommonStateProps = {
  isLoading: IsLoadingType
  currentPath: CurrentPath
}

export type SetIsLoadingPayload = {
  name: string
  isLoading: boolean
}

export type SetCurrentPathPayload = {
  currentPath: CurrentPath
}

const initialState: CommonStateProps = {
  isLoading: {},
  currentPath: null,
}

export const commonState = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<SetIsLoadingPayload>) => {
      state.isLoading = {
        ...state.isLoading,
        [payload.name]: payload.isLoading,
      }
    },
    setCurrentPath: (state, { payload }: PayloadAction<SetCurrentPathPayload>) => {
      state.currentPath = payload.currentPath
    },
  },
})

const getCommon = (state: RootState) => state.common

export const commonSelectors = {
  selectIsLoading: createSelector(getCommon, (common) => common.isLoading),
  selectCurrentPath: createSelector(getCommon, (common) => common.currentPath),
}

export const commonActions = commonState.actions
export default commonState
