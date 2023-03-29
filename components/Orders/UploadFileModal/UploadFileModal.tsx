import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ordersActions, ordersSelectors } from '@src/store'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { AddCircle, Check, Close } from '@mui/icons-material'
import { useGetOrdersList } from '@src/hooks'
import { SnackbarFunctionProps, withSnackbar } from '@components/HOC/WithSnackbar'

type UploadFileModalProps = {
  isOpen: boolean
  onClose: () => void
  method: 'createOrder' | 'updateOrder'
  showSnackbar: (props: SnackbarFunctionProps) => void
}

const UploadFileModalComponent = ({ isOpen, onClose, method, showSnackbar }: UploadFileModalProps) => {
  const dispatch = useDispatch()
  const fileUploadInputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>(null)
  const uploadedFiles = useSelector(ordersSelectors.selectUploadedFiles)
  const orderDetails = useSelector(ordersSelectors.selectOrderDetails)
  const [isUploading, setIsUploading] = useState(false)
  const [preventCloseInfo, setPreventCloseInfo] = useState(false)
  const { refreshOrdersList } = useGetOrdersList()

  useEffect(() => {
    if (method === 'updateOrder' && orderDetails.attachment) {
      dispatch(ordersActions.setUploadedFiles({ uploadedFiles: orderDetails.attachment }))
    }
  }, [])

  const handleOpenFileUpload = () => {
    fileUploadInputRef.current.click()
    setPreventCloseInfo(false)
  }

  const handleClearAllFiles = () => {
    setSelectedFiles(null)
    setPreventCloseInfo(false)
    fileUploadInputRef.current.value = ''
    fileUploadInputRef.current.files = undefined
    dispatch(ordersActions.setUploadedFiles({ uploadedFiles: null }))
  }

  const handleRemoveUploadedFile = (fileName) => {
    const newAttachments = uploadedFiles.filter((el) => el !== fileName)
    console.log(fileName, newAttachments)
    dispatch(ordersActions.setUploadedFiles({ uploadedFiles: newAttachments }))
  }

  const handleRemoveFileFromUploadQueue = (fileName) => {
    setSelectedFiles((prevState) => prevState.filter((el) => el.name !== fileName))
    if (uploadedFiles && uploadedFiles.find((el) => el.includes(fileName))) {
      dispatch(
        ordersActions.setUploadedFiles({
          uploadedFiles: uploadedFiles.filter((file) => !file.includes(fileName)),
        })
      )
    }

    const newFilesList = Array.from(fileUploadInputRef.current.files).filter((el: File) => el.name !== fileName)
    const dt = new DataTransfer()
    newFilesList.forEach((el: File) => dt.items.add(el))
    fileUploadInputRef.current.files = dt.files
    setPreventCloseInfo(false)
  }

  const isUploadedFile = useCallback(
    (name) => {
      if (!uploadedFiles || !uploadedFiles.length) return false
      return uploadedFiles.some((file) => file.includes(name))
    },
    [uploadedFiles]
  )

  const isEveryFileUploaded = useMemo(() => {
    if (method === 'updateOrder' && selectedFiles?.length) return false
    return !selectedFiles?.length
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
      await axios.post('/api/order/upload', formData).then((res) => {
        dispatch(
          ordersActions.setUploadedFiles({
            uploadedFiles: uploadedFiles ? [...uploadedFiles, ...res.data.files] : res.data.files,
          })
        )
        setSelectedFiles(null)
        setPreventCloseInfo(false)
        setIsUploading(false)
        showSnackbar({ message: 'Pliki przesłane pomyślnie', severity: 'success' })
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleSaveAttachments = async () => {
    if (method === 'createOrder') {
      dispatch(ordersActions.setCreateOrder({ attachment: uploadedFiles }))
    } else {
      await axios.post(`/api/order/${orderDetails.id}/update`, { attachment: uploadedFiles })
    }
    dispatch(ordersActions.setOrderDetails({ id: '' }))
    refreshOrdersList()
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={async (_, reason) => {
        if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && isEveryFileUploaded) {
          await handleSaveAttachments()
        }
        if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && !isEveryFileUploaded) {
          setPreventCloseInfo(true)
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Dodaj załączniki</DialogTitle>
      <DialogContent>
        {uploadedFiles && (
          <>
            <Typography variant="h4">Lista dodanych plików</Typography>
            <Stack spacing={1}>
              {uploadedFiles.map((file) => (
                <Paper
                  key={file}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingX: 2,
                    paddingY: 2,
                  }}
                >
                  <Typography variant="body2">{file}</Typography>
                  <Box
                    sx={{
                      height: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {isUploadedFile(file) && <Check color="success" />}
                    {isUploading ? (
                      <CircularProgress size={15} />
                    ) : (
                      <IconButton
                        onClick={() =>
                          isUploadedFile ? handleRemoveUploadedFile(file) : handleRemoveFileFromUploadQueue(file)
                        }
                      >
                        <Close color="error" />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </>
        )}
        {selectedFiles && !!selectedFiles.length && (
          <>
            <Typography variant="h4">Wybrane pliki</Typography>
            <Stack spacing={1}>
              {selectedFiles.map(({ name: file }) => (
                <Paper
                  key={file}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingX: 2,
                    paddingY: 2,
                  }}
                >
                  <Typography variant="body2">{file}</Typography>
                  <Box
                    sx={{
                      height: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {isUploadedFile(file) && <Check color="success" />}
                    {isUploading ? (
                      <CircularProgress size={15} />
                    ) : (
                      <IconButton
                        onClick={() =>
                          isUploadedFile ? handleRemoveUploadedFile(file) : handleRemoveFileFromUploadQueue(file)
                        }
                      >
                        <Close color="error" />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </>
        )}
        <Button
          size="large"
          startIcon={<AddCircle />}
          onClick={handleOpenFileUpload}
        >
          Dodaj pliki
        </Button>
        {selectedFiles && !!selectedFiles.length && (
          <Button
            startIcon={<Close />}
            color="error"
            onClick={handleClearAllFiles}
          >
            Usuń wszystkie
          </Button>
        )}
        <input
          ref={fileUploadInputRef}
          type="file"
          hidden
          multiple
          onChange={({ target }) => {
            if (target.files) {
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
        {preventCloseInfo && (
          <Alert
            variant="filled"
            severity="error"
          >
            Usuń pliki z kolejki dodawania lub prześlij pliki, aby zamknąć okno załączników
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={isEveryFileUploaded ? handleSaveAttachments : handleUpload}
        >
          {isEveryFileUploaded ? 'Zapisz' : 'Prześlij pliki'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const UploadFileModal = withSnackbar(UploadFileModalComponent)
