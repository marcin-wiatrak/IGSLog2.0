import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Return } from '@prisma/client'
import { RootState } from '@src/store'

export type ReturnsStateProps = {
  returnsList: Return[]
  returnDetails: Partial<Return>
}

type SetReturnsListPayload = {
  returnsList: Return[]
}

type SetReturnDetailsPayload = Partial<Return>

const initialState: ReturnsStateProps = {
  returnsList: [],
  returnDetails: {
    id: '',
  },
}

export const returnsState = createSlice({
  name: 'returns',
  initialState,
  reducers: {
    setReturnsList: (state, { payload }: PayloadAction<SetReturnsListPayload>) => {
      state.returnsList = payload.returnsList
    },
    setReturnDetails: (state, { payload }: PayloadAction<SetReturnDetailsPayload>) => {
      state.returnDetails = { ...state.returnDetails, ...payload }
    },
    clearReturnDetails: (state) => {
      state.returnDetails = initialState.returnDetails
    },
  },
})

const getReturn = (state: RootState) => state.returns

export const returnsSelectors = {
  selectReturnsList: createSelector(getReturn, (ret) => ret.returnsList),
  selectReturnDetails: createSelector(getReturn, (ret) => ret.returnDetails),
}

export const returnsActions = returnsState.actions
export default returnsState
