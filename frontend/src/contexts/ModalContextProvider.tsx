import { createContext, useContext, useState } from 'react'

interface ModalStateType {
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  modalTitle: string
  setModalTitle: React.Dispatch<React.SetStateAction<string>>
  customerContact: ICustomerContact | undefined
  setCustomerContact: React.Dispatch<
    React.SetStateAction<ICustomerContact | undefined>
  >
}
interface ICustomerContact {
  id: number | undefined
  fullName: string
}

const ModalContext = createContext<ModalStateType | null>(null)

export const useModalContext = (): ModalStateType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalState must be used within a ModalStateProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [modalTitle, setModalTitle] = useState('')
  const [customerContact, setCustomerContact] = useState<ICustomerContact>()

  return (
    <ModalContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        currentPage,
        setCurrentPage,
        modalTitle,
        setModalTitle,
        customerContact,
        setCustomerContact,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
