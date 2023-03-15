import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '@prisma/client'
import { RootState } from '@src/store'

export type UsersStateProps = {
  usersList: User[]
}

type SetUsersListPayload = {
  usersList: User[]
}

const initialState: UsersStateProps = {
  usersList: [],
}

export const usersState = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearState: (state) => {
      state.usersList
    },
    setUsersList: (state, { payload }: PayloadAction<SetUsersListPayload>) => {
      state.usersList = payload.usersList
    },
  },
})

const getOrder = (state: RootState) => state.users

export const usersSelectors = {
  selectUsersList: createSelector(getOrder, (order) => {
    return order.usersList
  }),
}

export const usersActions = usersState.actions
export default usersState
