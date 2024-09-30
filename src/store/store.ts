import { combineReducers, configureStore } from '@reduxjs/toolkit'
import ordersSlice, { ordersState } from '@src/store/orders.slice'
import customersState from '@src/store/customers.slice'
import usersState from '@src/store/users.slice'
import commonState from '@src/store/common.slice'
import returnsState from '@src/store/returns.slice'
import meetingsState from '@src/store/meetings.slice'
import { createTransform, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createFilter from 'redux-persist-transform-filter'

const ordersFiltersTransform = createFilter('orders', ['filters'])
const returnsFiltersTransform = createFilter('returns', ['filters'])

const ordersPersistConfig = {
  key: 'orders',
  storage,
  transforms: [ordersFiltersTransform],
  whitelist: ['filters'],
}

const returnsPersistConfig = {
  key: 'returns',
  storage,
  transforms: [returnsFiltersTransform],
  whitelist: ['filters'],
}

export const rootReducer = combineReducers({
  orders: persistReducer(ordersPersistConfig, ordersState.reducer),
  returns: persistReducer(returnsPersistConfig, returnsState.reducer),
  customers: customersState.reducer,
  users: usersState.reducer,
  common: commonState.reducer,
  meetings: meetingsState.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
