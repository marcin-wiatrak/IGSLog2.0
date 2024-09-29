import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ordersState } from '@src/store/orders.slice'
import customersState from '@src/store/customers.slice'
import usersState from '@src/store/users.slice'
import commonState from '@src/store/common.slice'
import returnsState from '@src/store/returns.slice'
import meetingsState from '@src/store/meetings.slice'
import { createTransform, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const saveFilters = createTransform(
  (inboundState, key) => {
    // @ts-ignore
    return { filters: inboundState.filters }
  },
  (outboundState, key) => {
    return { filters: outboundState.filters }
  },
  { whitelist: ['orders', 'returns'] }
)

const saveTypes = createTransform(
  (inboundState, key) => {
    // @ts-ignore
    return { filterByType: inboundState.filterByType }
  },
  (outboundState, key) => {
    return { filterByType: outboundState.filterByType }
  },
  { whitelist: ['orders', 'returns'] }
)

const ordersPersistConfig = {
  key: 'orders',
  storage,
  transforms: [saveFilters, saveTypes],
}

const returnsPersistConfig = {
  key: 'returns',
  storage,
  transforms: [saveFilters, saveTypes],
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
