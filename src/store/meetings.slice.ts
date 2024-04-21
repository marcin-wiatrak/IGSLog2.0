import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { Meeting, Unit } from '@prisma/client'
import { AutocompleteOptionType } from '@src/types'

export type MeetingsStateProps = {
  meetingsList: Meeting[]
  unitsList: Unit[]
  filters: FilterProps
}

type FilterProps = {
  string: string
  createdAtStart: string
  createdAtEnd: string
  meetingAtStart: string
  meetingAtEnd: string
  unit: AutocompleteOptionType[]
  handleBy: AutocompleteOptionType[]
}

type SetMeetingsListPayload = {
  meetingsList: Meeting[]
}

type SetUnitsListPayload = {
  unitsList: Unit[]
}

const initialFilters = {
  createdAtStart: null,
  createdAtEnd: null,
  meetingAtStart: null,
  meetingAtEnd: null,
  string: '',
  unit: [],
  handleBy: []
}

const initialState: MeetingsStateProps = {
  meetingsList: [],
  unitsList: null,
  filters: initialFilters,
}

export const meetingsState = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setMeetingsList: (state, { payload }: PayloadAction<SetMeetingsListPayload>) => {
      state.meetingsList = payload.meetingsList
    },
    setUnitsList: (state, { payload }: PayloadAction<SetUnitsListPayload>) => {
      state.unitsList = payload.unitsList
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters: (state) => {
      state.filters = initialFilters
    },
  },
})

const getMeeting = (state: RootState) => state.meetings

export const meetingsSelectors = {
  selectMeetingsList: createSelector(getMeeting, (meeting) => meeting.meetingsList),
  selectUnitsList: createSelector(getMeeting, (meeting) => meeting.unitsList),
  selectFilters: createSelector(getMeeting, (meeting) => meeting.filters),
}

export const meetingsActions = meetingsState.actions
export default meetingsState
