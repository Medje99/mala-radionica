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
  job: IJob
  setJob: React.Dispatch<React.SetStateAction<IJob>>
}

interface ICustomerContact {
  id: number | undefined
  fullName: string
}

interface IJob {
  end_date: Date | null
  job_id?: number
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
  const [job, setJob] = useState<IJob>({} as IJob)

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
        job,
        setJob,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
