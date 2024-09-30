import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Order } from '@prisma/client'
import { RootState } from '@src/store'
import { AutocompleteOptionType, OrderStatus, OrderType } from '@src/types'
import { toggleValueInArray } from '@src/utils'

export type OrdersStateProps = {
  ordersList: Order[]
  sorOrdersBy: string
  filterByType: OrderType[]
  filters: FilterProps
  currentOrderId: string
  createOrder: CreateOrder
  uploadedFiles: string[]
  localization: string
  orderDetails: Partial<Order>
}

type CreateOrder = Partial<Order>

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

type SetUploadedFilesPayload = {
  uploadedFiles: string[]
}

type SetAttachmentsPayload = {
  attachments: string[]
}

type SetOrderDetailsPayload = Partial<Order>

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

type UpdateOrderStatusPayload = {
  orderId: string
  status: OrderStatus
}

type FilterProps = {
  registeredBy: AutocompleteOptionType[]
  handleBy: AutocompleteOptionType[]
  localization: string
  createdAtStart: string
  createdAtEnd: string
  pickupAtStart: string
  pickupAtEnd: string
  status: string[]
  string: string
}

const initialFilters = {
  registeredBy: [],
  handleBy: [],
  localization: '',
  createdAtStart: null,
  createdAtEnd: null,
  pickupAtStart: null,
  pickupAtEnd: null,
  status: [],
  string: '',
}

const initialState: OrdersStateProps = {
  ordersList: [],
  sorOrdersBy: 'createdAt',
  filterByType: [],
  currentOrderId: '',
  filters: initialFilters,
  uploadedFiles: null,
  localization: '',
  orderDetails: {
    id: '',
    customerId: '',
    localization: '',
    pickupAt: null,
    notes: '',
    attachment: [],
  },
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
      state.filters = initialFilters
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
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    setCreateOrder: (state, { payload }: PayloadAction<SetCreateOrderPayload>) => {
      state.createOrder = { ...state.createOrder, ...payload }
    },
    setUploadedFiles: (state, { payload }: PayloadAction<SetUploadedFilesPayload>) => {
      state.uploadedFiles = payload.uploadedFiles
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = initialState.uploadedFiles
    },
    setOrderDetails: (state, { payload }: PayloadAction<SetOrderDetailsPayload>) => {
      state.orderDetails = { ...state.orderDetails, ...payload }
    },
    clearOrderDetails: (state) => {
      state.orderDetails = initialState.orderDetails
    },
    updateOrderStatus: (state, { payload }: PayloadAction<UpdateOrderStatusPayload>) => {
      const order = state.ordersList.find((el) => el.id === payload.orderId)
      order.status = payload.status
    },
  },
})

const getOrder = (state: RootState) => state.orders


export const ordersSelectors = {
  selectSelect: createSelector(getOrder, (order) => order),
  selectOrdersList: createSelector(getOrder, (order) => order.ordersList),
  selectSortOrdersBy: createSelector(getOrder, (order) => order.sorOrdersBy),
  selectFilterByType: createSelector(getOrder, (order) => order.filterByType),
  selectCurrentOrderId: createSelector(getOrder, (order) => order.currentOrderId),
  selectFilters: createSelector(getOrder, (order) => order.filters),
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
  selectUploadedFiles: createSelector(getOrder, (order) => order.uploadedFiles),
  selectOrderLocalization: createSelector(getOrder, (order) => order.localization),
  selectOrderDetails: createSelector(getOrder, (order) => order.orderDetails),
}

export const ordersActions = ordersState.actions
export default ordersState
