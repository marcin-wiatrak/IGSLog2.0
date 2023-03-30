import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '@prisma/client'
import { RootState } from '@src/store'

export type UsersStateProps = {
  usersList: User[]
  user: User
}

type SetUsersListPayload = {
  usersList: User[]
}

type SetUserPayload = {
  user: User
}

const initialState: UsersStateProps = {
  usersList: [],
  user: null,
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
    setUser: (state, { payload }: PayloadAction<SetUserPayload>) => {
      state.user = payload.user
    },
  },
})

const getOrder = (state: RootState) => state.users

export const usersSelectors = {
  selectUsersList: createSelector(getOrder, (order) => order.usersList),
  selectUser: createSelector(getOrder, (order) => order.user),
}

export const usersActions = usersState.actions
export default usersState
