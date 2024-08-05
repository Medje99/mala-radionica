/* eslint-disable @typescript-eslint/no-explicit-any */
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import React, { createContext, useContext, useEffect, useState } from 'react'
import createTaskFormActions from './actions'
import { Form } from 'antd'
import { CustomerSelect } from './types'
import { concateFullName } from '@/Utilities/setFullName'
import { IContacts } from '@/model/response/IContactResponse'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ContactService from '@/service/ContactsService'

interface FormContextType {
  newCustomer: boolean
  form: any // If you have a specific type for the form, replace `any` with that type
  pickedCustomer: IContacts | undefined
  inputValue: string
  handleInputChange: (
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => void
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  handleSelectChange: (
    value: string,
    setCurrentCustomer: React.Dispatch<
      React.SetStateAction<string | undefined>
    >,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => void
  filteredOptions: CustomerSelect[] | undefined
  setCurrentCustomer: React.Dispatch<React.SetStateAction<string | undefined>>
  currentCustomer: string | undefined
  modalIsOpen: boolean
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onHandleSubmit: (event: any) => void
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

// Create context with the proper type
const FormContext = createContext<FormContextType | null>(null)

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

const {
  setCustomerSelectOptions,
  setCustomerFormValues,
  handleInputChange,
  handleSelectChange,
} = createTaskFormActions()

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { customers } = useGetAllContacts()
  const [form] = Form.useForm<IContacts>()
  const [currentPage, setCurrentPage] = useState(0)

  const [currentCustomer, setCurrentCustomer] = useState<string | undefined>('')
  const [inputValue, setInputValue] = useState<string>(
    currentCustomer as string
  )
  const [newCustomer, setNewCustomer] = useState(false)

  const [newCustomerSelect, setNewCustomerSelect] = useState<CustomerSelect[]>()

  const pickedCustomer = customers.find(
    (item) => concateFullName(item.firstName, item.lastName) === currentCustomer
  )

  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    setCustomerSelectOptions(customers, setNewCustomerSelect)
  }, [customers])

  useEffect(() => {
    setCustomerFormValues(pickedCustomer, form, setNewCustomer)
  }, [pickedCustomer, form])

  const onHandleSubmit = (event: any) => {
    event.preventDefault()
    form
      .validateFields()
      .then((values) => {
        const { firstName } = values
        const separatedName = separateFullName(firstName)

        const formatedData = {
          ...values,
          firstName: separatedName.firstName,
          lastName: separatedName.lastName,
          id: 200,
        }

        ContactService.createContactCustomer(formatedData)
          .then((createdContact) => {
            console.log('Contact created:', createdContact)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo)
      })
      .finally(() => {
        setCurrentPage(currentPage + 1)
      })
  }

  return (
    <FormContext.Provider
      value={{
        newCustomer,
        form,
        pickedCustomer,
        inputValue,
        handleInputChange,
        setInputValue,
        handleSelectChange,
        filteredOptions,
        setCurrentCustomer,
        currentCustomer,
        modalIsOpen,
        setModalIsOpen,
        onHandleSubmit,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
