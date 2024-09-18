import { useEffect } from 'react'
import CreateBillForm from './forms/create-task-form-components/CreateBillForm'
import CreateContactForm from './forms/create-task-form-components/CreateContactForm'
import CreateTaskForm from './forms/create-task-form-components/CreateTaskForm'
import { useGlobalContext } from './GlobalContextProvider'

export default function MultiStepForm() {
  const { currentPage, setFormTitle, formTitleString, setHeaderTitle, setCurrentPage } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
    setCurrentPage(0)
  }, [])

  useEffect(() => {
    const titles = ['Izaberi ili dodaj musteriju', 'Unesi podatke o poslu', 'Naplata:']
    setFormTitle(titles[currentPage] || '')
  }, [currentPage])

  const renderFormPart = () => {
    const forms = [<CreateContactForm />, <CreateTaskForm />, <CreateBillForm callback={() => {}} />]
    return forms[currentPage] || null
  }

  return renderFormPart()
}
