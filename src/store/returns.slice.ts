import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Return } from '@prisma/client'
import { RootState } from '@src/store'
import { AutocompleteOptionType, OrderType, ReturnStatus } from '@src/types'
import { toggleValueInArray } from '@src/utils'

export type ReturnsStateProps = {
  returnsList: Return[]
  returnDetails: Partial<Return>
  filterByType: OrderType[]
  filters: FilterProps
  uploadedFiles: string[]
  attachments: string[]
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

type SetNewReturnAttachmentsPayload = {
  attachments: string[]
}

type SetFilterByTypePayload = {
  filterByType: OrderType
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
  filterByType: [],
  filters: initialFilters,
  uploadedFiles: [],
  attachments: [],
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
    setFilterByType: (state, { payload }: PayloadAction<SetFilterByTypePayload>) => {
      state.filterByType = toggleValueInArray(state.filterByType, payload.filterByType)
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
    setNewReturnAttachments: (state, { payload }: PayloadAction<SetNewReturnAttachmentsPayload>) => {
      state.attachments = payload.attachments
    }
  },
})

const getReturn = (state: RootState) => state.returns

export const returnsSelectors = {
  selectReturnsList: createSelector(getReturn, (ret) => ret.returnsList),
  selectReturnDetails: createSelector(getReturn, (ret) => ret.returnDetails),
  selectFilterByType: createSelector(getReturn, (ret) => ret.filterByType),
  selectFilters: createSelector(getReturn, (ret) => ret.filters),
  selectUploadedFiles: createSelector(getReturn, (ret) => ret.uploadedFiles),
  selectAttachments: createSelector(getReturn, (ret) => ret.attachments),
}

export const returnsActions = returnsState.actions
export default returnsState
