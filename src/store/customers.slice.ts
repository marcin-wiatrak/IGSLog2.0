import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Customer } from '@prisma/client'
import { RootState } from '@src/store'

export type CustomersStateProps = {
  customersList: Customer[]
}

type SetCustomersListPayload = {
  customersList: Customer[]
}

const initialState: CustomersStateProps = {
  customersList: [],
}

export const customersState = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearState: (state) => {
      state.customersList
    },
    setCustomersList: (state, { payload }: PayloadAction<SetCustomersListPayload>) => {
      state.customersList = payload.customersList
    },
  },
})

const getOrder = (state: RootState) => state.customers

export const customersSelectors = {
  selectCustomersList: createSelector(getOrder, (order) => {
    return order.customersList
  }),
}

export const customersActions = customersState.actions
export default customersState
