import { SideDrawer } from '@components/SideDrawer'
import { Badge, Box, Button, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { NewReturnForm } from '@components/Returns/NewReturnDrawer/parts/NewReturnForm'
import { Add, AddCircle, Clear } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { ordersSelectors, returnsActions, returnsSelectors } from '@src/store'
import { useDisclose } from '@src/hooks'
import { UploadFileModal } from '@components/Orders'

type NewReturnDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const NewReturnDrawer = ({ isOpen, onClose }: NewReturnDrawerProps) => {
  const attachment = useSelector(returnsSelectors.selectAttachments)
  const uploadedFiles = useSelector(returnsSelectors.selectUploadedFiles)
  console.log('attachment::::::', attachment)
  console.log('uploadedFiles:::', uploadedFiles)
  const dispatch = useDispatch()
  const formRef = useRef(null)
  const {
    isOpen: isUploadFileModalOpen,
    onOpen: onUploadFileModalOpen,
    onClose: onUploadFileModalClose,
  } = useDisclose()

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
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<AddCircle />}
                  onClick={onUploadFileModalOpen}
                  // disabled
                >
                  <Badge
                    badgeContent={attachment && attachment.length}
                    color="error"
                  >
                    Dodaj załączniki
                  </Badge>
                </Button>
              </Box>
            </Box>
                {/*<Typography*/}
                {/*  variant="caption"*/}
                {/*  align="center"*/}
                {/*  color="red"*/}
                {/*>*/}
                {/*  Tymczasowo, proszę o utworzenie zwrotu bez załącznika i dodanie go z poziomu listy zleceń*/}
                {/*</Typography>*/}
          </Stack>
        </Box>
      </SideDrawer>
      {isUploadFileModalOpen && (
        <UploadFileModal
          isOpen={isUploadFileModalOpen}
          onClose={onUploadFileModalClose}
          method="createOrder"
        />
      )}
    </>
  )
}
