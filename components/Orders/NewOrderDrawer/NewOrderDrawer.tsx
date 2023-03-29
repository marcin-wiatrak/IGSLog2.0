import { Badge, Box, Button, CircularProgress, Stack } from '@mui/material'
import { FC, useEffect, useMemo, useRef } from 'react'
import { Add, AddCircle, Clear } from '@mui/icons-material'
import { Customer } from '@prisma/client'
import { NewOrderForm } from './parts'
import { SideDrawer } from '@components/SideDrawer'
import { DrawerActionButton } from '@components/SideDrawer/parts/DrawerActions/DrawerActions'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'
import { useLoading } from '@src/hooks/useLoading/useLoading'
import { useDisclose } from '@src/hooks'
import { UploadFileModal } from '@components/Orders'

type NewOrderDrawerProps = {
  isOpen: boolean
  onClose: () => void
  customersList: Customer[]
  onRefreshCustomersList: () => void
}

export const NewOrderDrawer: FC<NewOrderDrawerProps> = ({ isOpen, onClose }) => {
  const { attachment: attachments } = useSelector(ordersSelectors.selectOrderForm)
  const dispatch = useDispatch()
  const {
    isOpen: isUploadFileModalOpen,
    onOpen: onUploadFileModalOpen,
    onClose: onUploadFileModalClose,
  } = useDisclose()
  const { isLoading } = useLoading()
  const ref = useRef(null)

  const handleFormClear = () => dispatch(ordersActions.resetOrderForm())

  const handleCreateOrder = () => {
    ref.current.submit()
  }

  useEffect(() => {
    return () => {
      dispatch(ordersActions.clearUploadedFiles())
    }
  }, [])

  const confirmButton: DrawerActionButton = useMemo(() => {
    return {
      label: isLoading('newOrder') ? 'Ładowanie' : 'Utwórz',
      startIcon: !isLoading('newOrder') ? (
        <Add />
      ) : (
        <CircularProgress
          size={16}
          color="inherit"
        />
      ),
      variant: 'contained',
      color: 'success',
      onClick: handleCreateOrder,
      size: 'large',
      fullWidth: true,
      disabled: isLoading('newOrder'),
    }
  }, [isLoading])

  return (
    <>
      <SideDrawer
        title="Utwórz zlecenie"
        onClose={onClose}
        open={isOpen}
        anchor="right"
        width={500}
        actionsList={[
          { ...confirmButton },
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
            <NewOrderForm
              ref={ref}
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
                >
                  <Badge
                    badgeContent={attachments && attachments.length}
                    color="error"
                  >
                    Dodaj załączniki
                  </Badge>
                </Button>
              </Box>
            </Box>
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
