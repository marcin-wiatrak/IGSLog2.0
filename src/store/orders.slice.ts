import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Order } from '@prisma/client'
import { RootState } from '@src/store'
import { OrderType } from '@src/types'

export type OrdersStateProps = {
  ordersList: Order[]
  sorOrdersBy: string
  filterByType: OrderType[]
}

type SetOrdersListPayload = {
  ordersList: Order[]
}

type SetSortByPayload = {
  sortOrdersBy: string
}

type SetFilterByTypePayload = {
  filterByType: OrderType
}

const initialState: OrdersStateProps = {
  ordersList: [],
  sorOrdersBy: 'createdAt',
  filterByType: [],
}

export const ordersState = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersList: (state, { payload }: PayloadAction<SetOrdersListPayload>) => {
      state.ordersList = payload.ordersList
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
  },
})

const getOrder = (state: RootState) => state.orders

export const ordersSelectors = {
  selectOrdersList: createSelector(getOrder, (order) => order.ordersList),
  selectSortOrdersBy: createSelector(getOrder, (order) => order.sorOrdersBy),
  selectFilterByType: createSelector(getOrder, (order) => order.filterByType),
}

export const ordersActions = ordersState.actions
export default ordersState
