import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

type IsLoadingType = {
  [name: string]: boolean
}

export type CommonStateProps = {
  isLoading: IsLoadingType
}

export type SetIsLoadingPayload = {
  name: string
  isLoading: boolean
}

const initialState: CommonStateProps = {
  isLoading: {},
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
  },
})

const getOrder = (state: RootState) => state.common

export const commonSelectors = {
  selectIsLoading: createSelector(getOrder, (common) => {
    return common.isLoading
  }),
}

export const commonActions = commonState.actions
export default commonState
