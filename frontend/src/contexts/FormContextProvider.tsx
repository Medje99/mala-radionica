/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react'
import { Form } from 'antd'
import { IContacts } from '@/model/response/IContactResponse'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import { CustomerSelect } from '@/components/create-task-form-component/types'
import { concateFullName } from '@/Utilities/setFullName'

// interface FormContextType {
//   form: FormInstance<IContacts>
//   customers: any
// }

// Create context with the proper type
const FormContext = createContext<any | null>(null)

export const useFormContext = (): any => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const { customers } = useGetAllContacts()
  const [form] = Form.useForm<IContacts>()
  const [currentCustomer, setCurrentCustomer] = useState<string | undefined>('')
  const [inputValue, setInputValue] = useState<string>(
    currentCustomer as string
  )

  const [newCustomerSelect, setNewCustomerSelect] = useState<CustomerSelect[]>()

  const pickedCustomer = customers.find(
    (item) => concateFullName(item.firstName, item.lastName) === currentCustomer
  )

  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <FormContext.Provider
      value={{
        form,
        customers,
        inputValue,
        pickedCustomer,
        filteredOptions,
        currentCustomer,
        setCurrentCustomer,
        setNewCustomerSelect,
        setInputValue,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
