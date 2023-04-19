import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { meetingsActions, meetingsSelectors } from '@src/store/meetings.slice'
import { useCallback } from 'react'

export const useGetMeetingsList = () => {
  const meetingsList = useSelector(meetingsSelectors.selectMeetingsList)
  const dispatch = useDispatch()

  const getMeetingsList = useCallback(() => {
    const meetingsListQuery = async () => await axios.get('/api/meeting/list')
    meetingsListQuery().then((res) => {
      dispatch(meetingsActions.setMeetingsList({ meetingsList: res.data }))
    })
  }, [])

  return {
    meetingsList,
    getMeetingsList,
    refreshMeetingsList: getMeetingsList,
  }
}
