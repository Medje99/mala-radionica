import { createContext, useContext, useState } from 'react'

interface ModalStateType {
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const ModalContext = createContext<ModalStateType | null>(null)

export const useModal = (): ModalStateType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalState must be used within a ModalStateProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  return (
    <ModalContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
