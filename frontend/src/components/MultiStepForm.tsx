import { useEffect } from 'react'
import CreateBillForm from './forms/CreateBillForm'
import CreateContactForm from './forms/CreateContactForm'
import CreateTaskForm from './forms/CreateTaskForm'
import { useGlobalContext } from './GlobalContextProvider'

export default function MultiStepForm() {
  const {
    currentPage,
    setFormTitle: setFormTitle,
    formTitleString,
    setHeaderTitle,
    headerTitle,
    setCurrentPage,
  } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
    setCurrentPage(0)
  }, [MultiStepForm])

  //must be separate inside of useEffect because it needs to load when currentPage is loaded
  useEffect(() => {
    switch (currentPage) {
      case 0:
        setFormTitle('Izaberi ili dodaj musteriju ')
        console.log(formTitleString, 'formTitleString set by contacts ')
        console.log(headerTitle)
        break
      case 1:
        setFormTitle('Unesi podatke o poslu')
        console.log(formTitleString, 'formTitleString set by task ')
        break
      case 2:
        setFormTitle('Naplata:')
        console.log(formTitleString, 'formTitleString set by bill ')
        break
      default:
        break
    }
  }, [currentPage]) // Add currentPage as a dependency

  const renderFormPart = () => {
    switch (currentPage) {
      case 0:
        return <CreateContactForm />
      case 1:
        return <CreateTaskForm />
      case 2:
        return <CreateBillForm callback={() => {}} />
      default:
        return null
    }
  }

  return renderFormPart()
}
