import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { CurrentPath } from '@src/types'
import dayjs, { Dayjs } from 'dayjs'
import { Meeting, Order, Return } from '@prisma/client'

type IsLoadingType = {
  [name: string]: boolean
}

type CalendarSummaryDataProps = {
  createdBy: Order[]
  meetingAssignedTo: Meeting[]
  returnCreatedBy: Return[]
}

type CalendarDataProps = {
  orders: Order[]
  returns: Return[]
}

export type CommonStateProps = {
  isLoading: IsLoadingType
  currentPath: CurrentPath
  calendarDay: string
  calendarSummaryData: CalendarSummaryDataProps
  findString: string
  calendarData: CalendarDataProps
}

export type SetIsLoadingPayload = {
  name: string
  isLoading: boolean
}

export type SetCurrentPathPayload = {
  currentPath: CurrentPath
}

export type SetCalendarDayPayload = {
  calendarDay: string
}

export type SetCalendarSummaryDataPayload = {
  calendarSummaryData: CalendarSummaryDataProps
}

export type SetFindStringPayload = {
  value: string
}

export type SetCalendarDataPayload = {
  calendarData: CalendarDataProps
}

const initialState: CommonStateProps = {
  isLoading: {},
  currentPath: null,
  calendarDay: dayjs().startOf('day').format(),
  calendarSummaryData: null,
  findString: '',
  calendarData: null,
}

export const commonState = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<SetIsLoadingPayload>) => {
      state.isLoading = {
        ...state.isLoading,
        [payload.name]: payload.isLoading,
      }
    },
    setCurrentPath: (state, { payload }: PayloadAction<SetCurrentPathPayload>) => {
      state.currentPath = payload.currentPath
    },
    setCalendarDay: (state, { payload }: PayloadAction<SetCalendarDayPayload>) => {
      state.calendarDay = payload.calendarDay
    },
    setCalendarSummaryData: (state, { payload }: PayloadAction<SetCalendarSummaryDataPayload>) => {
      state.calendarSummaryData = payload.calendarSummaryData
    },
    setFindString: (state, { payload }: PayloadAction<SetFindStringPayload>) => {
      state.findString = payload.value
    },
    setCalendarData: (state, { payload }: PayloadAction<SetCalendarDataPayload>) => {
      state.calendarData = payload.calendarData
    },
  },
})

const getCommon = (state: RootState) => state.common

export const commonSelectors = {
  selectIsLoading: createSelector(getCommon, (common) => common.isLoading),
  selectCurrentPath: createSelector(getCommon, (common) => common.currentPath),
  selectCalendarDay: createSelector(getCommon, (common) => common.calendarDay),
  selectCalendarSummaryData: createSelector(getCommon, (common) => common.calendarSummaryData),
  selectFindString: createSelector(getCommon, (common) => common.findString),
  selectCalendarData: createSelector(getCommon, (common) => common.calendarData),
}

export const commonActions = commonState.actions
export default commonState
