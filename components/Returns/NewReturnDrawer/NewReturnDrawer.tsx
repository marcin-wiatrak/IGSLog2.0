import { SideDrawer } from '@components/SideDrawer'
import { Box, Stack } from '@mui/material'
import { useRef } from 'react'
import { NewReturnForm } from '@components/Returns/NewReturnDrawer/parts/NewReturnForm'
import { Add, Clear } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { returnsActions } from '@src/store'

type NewReturnDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const NewReturnDrawer = ({ isOpen, onClose }: NewReturnDrawerProps) => {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  const handleFormClear = () => {
    formRef.current.clearForm()
    dispatch(returnsActions.clearReturnDetails())
  }

  const handleCreateReturn = () => {
    formRef.current.submit()
  }

  return (
    <>
      <SideDrawer
        title="Utwórz zwrot"
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
            onClick: handleCreateReturn,
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
            <NewReturnForm
              ref={formRef}
              onDrawerClose={onClose}
            />
            {/*  <Box>*/}
            {/*    <Box*/}
            {/*      sx={{*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'space-between',*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <Button*/}
            {/*        variant="contained"*/}
            {/*        size="large"*/}
            {/*        fullWidth*/}
            {/*        startIcon={<AddCircle />}*/}
            {/*        onClick={onUploadFileModalOpen}*/}
            {/*      >*/}
            {/*        <Badge*/}
            {/*          badgeContent={attachments && attachments.length}*/}
            {/*          color="error"*/}
            {/*        >*/}
            {/*          Dodaj załączniki*/}
            {/*        </Badge>*/}
            {/*      </Button>*/}
            {/*    </Box>*/}
            {/*  </Box>*/}
          </Stack>
        </Box>
      </SideDrawer>
      {/*{isUploadFileModalOpen && (*/}
      {/*  <UploadFileModal*/}
      {/*    isOpen={isUploadFileModalOpen}*/}
      {/*    onClose={onUploadFileModalClose}*/}
      {/*    method="createOrder"*/}
      {/*  />*/}
      {/*)}*/}
    </>
  )
}
