import { useState } from 'react'

export const useDisclose = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  return {
    isOpen,
    onOpen,
    onClose,
  }
}
