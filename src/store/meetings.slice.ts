import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { Meeting, Unit } from '@prisma/client'

export type MeetingsStateProps = {
  meetingsList: Meeting[]
  unitsList: Unit[]
}

type SetMeetingsListPayload = {
  meetingsList: Meeting[]
}

type SetUnitsListPayload = {
  unitsList: Unit[]
}

const initialState: MeetingsStateProps = {
  meetingsList: [],
  unitsList: null,
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
  },
})

const getMeeting = (state: RootState) => state.meetings

export const meetingsSelectors = {
  selectMeetingsList: createSelector(getMeeting, (meeting) => meeting.meetingsList),
  selectUnitsList: createSelector(getMeeting, (meeting) => meeting.unitsList),
}

export const meetingsActions = meetingsState.actions
export default meetingsState
