import { createContext, useContext, useState } from 'react'

interface ModalStateType {
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  modalTitle: string
  setModalTitle: React.Dispatch<React.SetStateAction<string>>
  customerContact: ICustomerContact | undefined
  setCustomerContact: React.Dispatch<React.SetStateAction<ICustomerContact | undefined>>
  job: ITask
  setJob: React.Dispatch<React.SetStateAction<ITask>>
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>
  headerTitle: string
}

export interface ICustomerContact {
  id: number | undefined
  fullName: string
}

export interface ITask {
  end_date?: Date | null
  task_id?: number
  task_name?: string
}

const GlobalContext = createContext<ModalStateType | null>(null)

export const useGlobalContext = (): ModalStateType => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useModalState must be used within a ModalStateProvider')
  }
  return context
}

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [modalTitle, setModalTitle] = useState('')
  const [customerContact, setCustomerContact] = useState<ICustomerContact>()
  const [job, setJob] = useState<ITask>({} as ITask)
  const [headerTitle, setHeaderTitle] = useState('NOTHING YET')

  return (
    <GlobalContext.Provider
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
        headerTitle,
        setHeaderTitle,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}