import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Order } from '@prisma/client'
import { RootState } from '@src/store'
import { AutocompleteOptionType, OrderType } from '@src/types'

export type OrdersStateProps = {
  ordersList: Order[]
  sorOrdersBy: string
  filterByType: OrderType[]
  currentOrderId: string
  filterRegisteredBy: AutocompleteOptionType[]
  filterHandleBy: AutocompleteOptionType[]
  filterLocalization: string
  filterCreatedAtStart: string
  filterCreatedAtEnd: string
}

type SetOrdersListPayload = {
  ordersList: Order[]
}

type SetSortByPayload = {
  sortOrdersBy: string
}

type SetCurrentOrderIdPayload = {
  currentOrderId: string
}

type SetFilterByTypePayload = {
  filterByType: OrderType
}

type SetFilterHandleByPayload = {
  filterHandleBy: AutocompleteOptionType[]
}

type SetFilterRegisteredByPayload = {
  filterRegisteredBy: AutocompleteOptionType[]
}

type SetFilterLocalizationPayload = {
  filterLocalization: string
}

type SetFilterCreatedAtStartPayload = {
  filterCreatedAtStart: string
}

type SetFilterCreatedAtEndPayload = {
  filterCreatedAtEnd: string
}

const initialState: OrdersStateProps = {
  ordersList: [],
  sorOrdersBy: 'createdAt',
  filterByType: [],
  currentOrderId: '',
  filterRegisteredBy: [],
  filterHandleBy: [],
  filterLocalization: '',
  filterCreatedAtStart: null,
  filterCreatedAtEnd: null,
}

export const ordersState = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.filterRegisteredBy = initialState.filterRegisteredBy
      state.filterHandleBy = initialState.filterHandleBy
      state.filterLocalization = initialState.filterLocalization
      state.filterCreatedAtStart = initialState.filterCreatedAtStart
      state.filterCreatedAtEnd = initialState.filterCreatedAtEnd
    },
    setOrdersList: (state, { payload }: PayloadAction<SetOrdersListPayload>) => {
      state.ordersList = payload.ordersList
    },
    setCurrentOrderId: (state, { payload }: PayloadAction<SetCurrentOrderIdPayload>) => {
      state.currentOrderId = payload.currentOrderId
    },
    setSortBy: (state, { payload }: PayloadAction<SetSortByPayload>) => {
      state.sorOrdersBy = payload.sortOrdersBy
    },
    setFilterByType: (state, { payload }: PayloadAction<SetFilterByTypePayload>) => {
      const filtersArray = [...state.filterByType]
      state.filterByType = filtersArray.includes(payload.filterByType)
        ? filtersArray.filter((el) => el !== payload.filterByType)
        : [...filtersArray, payload.filterByType]
    },
    setFilterRegisteredBy: (state, { payload }: PayloadAction<SetFilterRegisteredByPayload>) => {
      state.filterRegisteredBy = payload.filterRegisteredBy
    },
    setFilterUserId: (state, { payload }: PayloadAction<SetFilterHandleByPayload>) => {
      state.filterHandleBy = payload.filterHandleBy
    },
    setFilterLocalization: (state, { payload }: PayloadAction<SetFilterLocalizationPayload>) => {
      state.filterLocalization = payload.filterLocalization
    },
    setFilterCreatedAtStart: (state, { payload }: PayloadAction<SetFilterCreatedAtStartPayload>) => {
      state.filterCreatedAtStart = payload.filterCreatedAtStart
    },
    setFilterCreatedAtEnd: (state, { payload }: PayloadAction<SetFilterCreatedAtEndPayload>) => {
      state.filterCreatedAtEnd = payload.filterCreatedAtEnd
    },
  },
})

const getOrder = (state: RootState) => state.orders

export const ordersSelectors = {
  selectOrdersList: createSelector(getOrder, (order) => order.ordersList),
  selectSortOrdersBy: createSelector(getOrder, (order) => order.sorOrdersBy),
  selectFilterByType: createSelector(getOrder, (order) => order.filterByType),
  selectCurrentOrderId: createSelector(getOrder, (order) => order.currentOrderId),
  selectFilterRegisteredBy: createSelector(getOrder, (order) => ({
    registeredBy: order.filterRegisteredBy,
    handleBy: order.filterHandleBy,
    localization: order.filterLocalization,
    createdAtStart: order.filterCreatedAtStart,
    createdAtEnd: order.filterCreatedAtEnd,
  })),
}

export const ordersActions = ordersState.actions
export default ordersState
