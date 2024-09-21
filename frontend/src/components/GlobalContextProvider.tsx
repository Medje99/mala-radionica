import { IContact } from '@/model/response/IContactResponse'
import { ITask } from '@/model/response/ITaskResponse'
import { Typography } from 'antd'
import { createContext, useContext, useState } from 'react'

interface GlobalContext {
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  formTitle: string | React.ReactElement
  setFormTitle: React.Dispatch<React.SetStateAction<string>>
  Contact: IContact | undefined
  setContextContact: React.Dispatch<React.SetStateAction<IContact | undefined>>
  currentTask: ITask
  setCurrentTask: React.Dispatch<React.SetStateAction<ITask>>
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>
  headerTitle: string
  end_date: ITask['end_date']
  setEndDate: React.Dispatch<React.SetStateAction<ITask['end_date']>>
  formTitleString: string
}

const GlobalContext = createContext<GlobalContext | null>(null)

export const useGlobalContext = (): GlobalContext => {
  const context = useContext(GlobalContext)
  // useContext hook is used to access the value of the context object
  // within the component that is using the context.

  // If the context is not found, it throws an error, indicating that the component is not
  // wrapped by the ContextProvider.
  if (!context) {
    throw new Error('useModalState must be used within a ModalStateProvider')
  }
  return context
}

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [formTitle, setFormTitle] = useState('Izaberi ili dodaj musteriju')
  const [Contact, setContextContact] = useState<IContact>()
  const [currentTask, setCurrentTask] = useState<ITask>({} as ITask)
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
        Contact,
        setContextContact,
        currentTask,
        setCurrentTask: setCurrentTask,
        headerTitle,
        setHeaderTitle,
        end_date,
        setEndDate,
      }}
    >
      {/* this is a prop that is passed to the ContextProvider component. It is used to render the children of the ContextProvider component after appending the context to the children. */}
      {children}
      {/* The children prop is used to render the components that are wrapped by the ContextProvider component. */}
    </GlobalContext.Provider>
  )
}
