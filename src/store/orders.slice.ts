import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Order } from '@prisma/client'
import { RootState } from '@src/store'
import { AutocompleteOptionType, OrderType } from '@src/types'
import { toggleValueInArray } from '@src/utils'

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
  createOrder: CreateOrder
}

type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>

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

type SetCreateOrderPayload = {
  type?: OrderType[]
  customerId?: string
  registeredById?: string
  handleById?: string
  attachment?: string[]
  localization?: string
  pickupAt?: Date
  notes?: string
  signature?: string
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
  createOrder: {
    type: [],
    customerId: '',
    registeredById: '',
    handleById: '',
    attachment: [],
    localization: '',
    pickupAt: null,
    notes: '',
    signature: '',
  },
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
    resetOrderForm: (state) => {
      state.createOrder = initialState.createOrder
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
      state.filterByType = toggleValueInArray(state.filterByType, payload.filterByType)
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
    setCreateOrder: (state, { payload }: PayloadAction<SetCreateOrderPayload>) => {
      state.createOrder = { ...state.createOrder, ...payload }
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
  selectOrderForm: createSelector(getOrder, (order) => ({
    type: order.createOrder.type,
    customerId: order.createOrder.customerId,
    registeredById: order.createOrder.registeredById,
    handleById: order.createOrder.handleById,
    attachment: order.createOrder.attachment,
    localization: order.createOrder.localization,
    pickupAt: order.createOrder.pickupAt,
    notes: order.createOrder.notes,
    signature: order.createOrder.signature,
  })),
}

export const ordersActions = ordersState.actions
export default ordersState
