import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ordersState } from '@src/store/orders.slice'
import customersState from '@src/store/customers.slice'
import usersState from '@src/store/users.slice'
import commonState from '@src/store/common.slice'
import returnsState from '@src/store/returns.slice'
import meetingsState from '@src/store/meetings.slice'

export const rootReducer = combineReducers({
  orders: ordersState.reducer,
  customers: customersState.reducer,
  users: usersState.reducer,
  common: commonState.reducer,
  returns: returnsState.reducer,
  meetings: meetingsState.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
