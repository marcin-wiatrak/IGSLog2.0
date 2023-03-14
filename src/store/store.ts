import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ordersState } from '@src/store/orders.slice'
import customersState from '@src/store/customers.slice'

export const rootReducer = combineReducers({
  orders: ordersState.reducer,
  customers: customersState.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
