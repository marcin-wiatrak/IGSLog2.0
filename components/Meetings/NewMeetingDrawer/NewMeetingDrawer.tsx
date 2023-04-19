import { SideDrawer } from '@components/SideDrawer'
import { Badge, Box, Button, Stack } from '@mui/material'
import { NewOrderForm } from '@components/Orders/NewOrderDrawer/parts'
import { Add, AddCircle, Clear } from '@mui/icons-material'
import { useRef } from 'react'
import { returnsActions } from '@src/store'
import { useDispatch } from 'react-redux'
import { NewMeetingForm } from '@components/Meetings/NewMeetingDrawer/parts'

type NewMeetingDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const NewMeetingDrawer = ({ onClose, isOpen }: NewMeetingDrawerProps) => {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  const handleFormClear = () => {
    formRef.current.clearForm()
    dispatch(returnsActions.clearReturnDetails())
  }

  const handleCreateMeeting = () => {
    formRef.current.submit()
  }

  return (
    <>
      <SideDrawer
        title="Utwórz spotkanie"
        onClose={onClose}
        open={isOpen}
        anchor="right"
        width={500}
        actionsList={[
          {
            label: 'Utwórz',
            startIcon: <Add />,
            variant: 'contained',
            color: 'success',
            onClick: handleCreateMeeting,
            size: 'large',
            fullWidth: true,
          },
          {
            label: 'Wyczyść',
            startIcon: <Clear />,
            variant: 'text',
            color: 'error',
            onClick: handleFormClear,
            size: 'large',
          },
        ]}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Stack spacing={3}>
            <NewMeetingForm
              ref={formRef}
              onDrawerClose={onClose}
            />
          </Stack>
        </Box>
      </SideDrawer>
    </>
  )
}
