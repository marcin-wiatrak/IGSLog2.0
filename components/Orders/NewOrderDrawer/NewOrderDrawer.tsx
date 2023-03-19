import { Box, Button, CircularProgress, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material'
import { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Add, AddCircle, Check, Clear, Close, UploadFile } from '@mui/icons-material'
import { Customer } from '@prisma/client'
import { NewCustomerForm, NewOrderForm } from './parts'
import axios from 'axios'
import { SideDrawer } from '@components/SideDrawer'
import { DrawerActionButton } from '@components/SideDrawer/parts/DrawerActions/DrawerActions'

type NewOrderDrawerProps = {
  isOpen: boolean
  onClose: () => void
  customersList: Customer[]
  onRefreshCustomersList: () => void
}

type AutocompleteCustomer = {
  customer: {
    id: string
    label: string
  }
}

const formReducer = (state = initialFormState, action) => {
  const { value, field } = action.payload

  if (action.type === 'form') {
    return { ...state, [field]: value }
  }
  if (action.type === 'checkbox') {
    const typesArray = [...state.type]
    const newTypesArray = typesArray.includes(value)
      ? typesArray.filter((type) => type !== value)
      : [...typesArray, value]
    return { ...state, [field]: newTypesArray }
  }
  if (action.type === 'clearForm') {
    return initialFormState
  }
}

const initialFormState = {
  customer: null,
  signature: '',
  pickupAt: null,
  localization: '',
  handleById: '',
  registeredById: '',
  status: 'NEW',
  notes: '',
  type: [],
}

export const NewOrderDrawer: FC<NewOrderDrawerProps> = ({ isOpen, onClose, customersList, onRefreshCustomersList }) => {
  const ref = useRef(null)
  const [form, formDispatch] = useReducer(formReducer, initialFormState)
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState<boolean>(false)
  const session = useSession()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(null)

  const [selectedFiles, setSelectedFiles] = useState<File[]>(null)
  const fileUploadInputRef = useRef(null)

  const handleOpenFileUpload = () => {
    fileUploadInputRef.current.click()
  }

  const handleRemoveFileFromUploadQueue = (fileName) => {
    setSelectedFiles((prevState) => prevState.filter((el) => el.name !== fileName))
    setUploadedFiles((prevState) => prevState.filter((file) => !file.includes(fileName)))
  }

  const isUploadedFile = useCallback(
    (name) => {
      if (!uploadedFiles || !uploadedFiles.length) return false
      return uploadedFiles.some((file) => file.includes(name))
    },
    [uploadedFiles]
  )

  const isEveryFileUploaded = useMemo(() => {
    if (!selectedFiles && !uploadedFiles) return true
    return selectedFiles && !uploadedFiles
      ? false
      : selectedFiles.every((el) => !!uploadedFiles.find((file) => file.includes(el.name)))
  }, [selectedFiles, uploadedFiles])

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      if (!selectedFiles) return
      const formData = new FormData()
      selectedFiles
        .filter((file) => !isUploadedFile(file.name))
        .forEach((el) => {
          formData.append('file', el, el.name)
        })
      await axios
        .post('/api/order/upload', formData)
        .then((res) => {
          setUploadedFiles((prevState) => (prevState ? [...prevState, ...res.data.files] : res.data.files))
          setIsUploading(false)
          return res.data.files
        })
        .then((res) => {
          console.log(res)
        })
    } catch (e) {
      console.log(e)
    }
  }

  const handleFormClear = () => formDispatch({ type: 'clearForm' })
  const handleFormChange = (field, value, method = 'form') => formDispatch({ type: method, payload: { field, value } })

  const handleNewCustomerFormToggle = () => setIsCustomerFormOpen((prevState) => !prevState)
  const handleNewCustomerFormClose = () => setIsCustomerFormOpen(false)

  const handleSelectCreatedCustomer = (payload) => {
    formDispatch({ type: 'form', payload: { field: 'customer', value: payload } })
  }

  const handleCreateOrder = () => {
    ref.current.submit()
  }

  useEffect(() => {
    if (!form.registeredById && session.data) {
      handleFormChange('registeredBy', session.data.user.userId)
    }
  }, [form.registeredById, session.data])

  const confirmButton: DrawerActionButton = useMemo(() => {
    return isEveryFileUploaded
      ? {
          label: 'Utwórz',
          startIcon: <Add />,
          variant: 'contained',
          color: 'success',
          onClick: handleCreateOrder,
          size: 'large',
          fullWidth: true,
        }
      : {
          label: 'Prześlij pliki',
          startIcon: <UploadFile />,
          variant: 'contained',
          color: 'info',
          onClick: handleUpload,
          size: 'large',
          fullWidth: true,
        }
  }, [isEveryFileUploaded])

  return (
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
          {/*<OrderTypeCheckboxGroup />*/}
          <NewOrderForm
            ref={ref}
            handleNewCustomerFormToggle={handleNewCustomerFormToggle}
            isCustomerFormOpen={isCustomerFormOpen}
          />
          <Collapse
            orientation="vertical"
            in={isCustomerFormOpen}
            unmountOnExit
            mountOnEnter
          >
            <NewCustomerForm
              isOpen={isCustomerFormOpen}
              onClose={handleNewCustomerFormClose}
              onCustomerSet={handleSelectCreatedCustomer}
              onRefreshCustomersList={onRefreshCustomersList}
            />
          </Collapse>
          <input
            ref={fileUploadInputRef}
            type="file"
            hidden
            multiple
            onChange={({ target }) => {
              if (target.files) {
                console.log(target.files)
                setSelectedFiles((prevState) => {
                  const newFiles = Array.from(target.files)
                  if (!prevState) return newFiles
                  const duplicated = prevState.filter((el) => {
                    return !newFiles.some((file) => file.name === el.name && file.size === el.size)
                  })
                  return [...duplicated, ...newFiles]
                })
              }
            }}
          />
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                startIcon={<AddCircle />}
                onClick={handleOpenFileUpload}
              >
                Dodaj załącznik
              </Button>
              {selectedFiles && (
                <Button
                  startIcon={<Close />}
                  color="error"
                  onClick={() => setSelectedFiles(null)}
                >
                  Usuń wszystkie
                </Button>
              )}
            </Box>
            {selectedFiles && (
              <Stack spacing={1}>
                {selectedFiles.map((file) => (
                  <Paper
                    key={file.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingX: 2,
                      paddingY: 2,
                    }}
                  >
                    <Typography variant="body2">{file.name}</Typography>
                    <Box
                      sx={{
                        height: 20,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {isUploadedFile(file.name) && <Check color="success" />}
                      {isUploading ? (
                        <CircularProgress size={15} />
                      ) : (
                        <IconButton onClick={() => handleRemoveFileFromUploadQueue(file.name)}>
                          <Close color="error" />
                        </IconButton>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    </SideDrawer>
  )
}
