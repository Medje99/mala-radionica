import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { useEffect } from 'react'
import CreateBillForm from './modal-form-parts/CreateBillForm'
import CreateContactForm from './modal-form-parts/CreateContactForm'
import CreateTaskForm from './modal-form-parts/CreateTaskForm'

export function MultiStepForm() {
  const { currentPage, setFormTitle: setFormTitle, formTitleString, setHeaderTitle, headerTitle } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
  }, [MultiStepForm])

  //must be separate inside of useEffect because it needs to load when currentPage is loaded
  useEffect(() => {
    switch (currentPage) {
      case 0:
        setFormTitle('Izaberi ili dodaj musteriju ')
        console.log(formTitleString)
        console.log(headerTitle)
        break
      case 1:
        setFormTitle('Unesi podatke o poslu')
        console.log(formTitleString)
        break
      case 2:
        setFormTitle('Naplata:')
        console.log(formTitleString)
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
        return <CreateBillForm />
      default:
        return null
    }
  }

  return renderFormPart()
}
