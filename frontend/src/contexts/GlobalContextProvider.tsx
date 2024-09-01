import { Typography } from 'antd'
import { createContext, useContext, useState } from 'react'

interface ModalStateType {
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  formTitle: string | React.ReactElement
  setFormTitle: React.Dispatch<React.SetStateAction<string>>
  customerContact: ICustomerContact | undefined
  setCustomerContact: React.Dispatch<React.SetStateAction<ICustomerContact | undefined>>
  job: ITask
  setJob: React.Dispatch<React.SetStateAction<ITask>>
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>
  headerTitle: string
  end_date: ITask['end_date']
  setEndDate: React.Dispatch<React.SetStateAction<ITask['end_date']>>
  formTitleString: string
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
  const [formTitle, setFormTitle] = useState('Izaberi ili dodaj musteriju')
  const [customerContact, setCustomerContact] = useState<ICustomerContact>()
  const [job, setJob] = useState<ITask>({} as ITask)
  const [headerTitle, setHeaderTitle] = useState('')
  const [end_date, setEndDate] = useState<ITask['end_date']>()

  return (
    <GlobalContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        currentPage,
        setCurrentPage,
        formTitle: (
          <Typography className="lg:leading-tighter text-4xl font-bold tracking-tighter align-center">
            {formTitle}
          </Typography>
        ),
        formTitleString: formTitle,
        setFormTitle: setFormTitle,
        customerContact,
        setCustomerContact,
        job,
        setJob,
        headerTitle,
        setHeaderTitle,
        end_date,
        setEndDate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
