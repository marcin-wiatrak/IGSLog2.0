import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Return } from '@prisma/client'
import { RootState } from '@src/store'
import { AutocompleteOptionType, ReturnStatus } from '@src/types'

export type ReturnsStateProps = {
  returnsList: Return[]
  returnDetails: Partial<Return>
  filters: FilterProps
  uploadedFiles: string[]
}

type FilterProps = {
  registeredBy: AutocompleteOptionType[]
  handleBy: AutocompleteOptionType[]
  createdAtStart: string
  createdAtEnd: string
  returnAtStart: string
  returnAtEnd: string
  localization: string
  status: string[]
  string: string
}

type SetReturnsListPayload = {
  returnsList: Return[]
}

type SetReturnDetailsPayload = Partial<Return>

type UpdateReturnStatusPayload = {
  returnId: string
  status: ReturnStatus
}

type SetUploadedFilesPayload = {
  uploadedFiles: string[]
}

const initialFilters = {
  registeredBy: [],
  handleBy: [],
  createdAtStart: null,
  createdAtEnd: null,
  returnAtStart: null,
  returnAtEnd: null,
  localization: '',
  status: [],
  string: '',
}

const initialState: ReturnsStateProps = {
  returnsList: [],
  returnDetails: {
    id: '',
  },
  filters: initialFilters,
  uploadedFiles: [],
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
    updateReturnStatus: (state, { payload }: PayloadAction<UpdateReturnStatusPayload>) => {
      const ret = state.returnsList.find((el) => el.id === payload.returnId)
      ret.status = payload.status
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters: (state) => {
      state.filters = initialFilters
    },
    setUploadedFiles: (state, { payload }: PayloadAction<SetUploadedFilesPayload>) => {
      state.uploadedFiles = payload.uploadedFiles
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = initialState.uploadedFiles
    },
  },
})

const getReturn = (state: RootState) => state.returns

export const returnsSelectors = {
  selectReturnsList: createSelector(getReturn, (ret) => ret.returnsList),
  selectReturnDetails: createSelector(getReturn, (ret) => ret.returnDetails),
  selectFilters: createSelector(getReturn, (ret) => ret.filters),
  selectUploadedFiles: createSelector(getReturn, (ret) => ret.uploadedFiles),
}

export const returnsActions = returnsState.actions
export default returnsState
