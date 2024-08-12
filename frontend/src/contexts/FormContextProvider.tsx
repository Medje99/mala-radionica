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
  const [hybridInputSelect, setHybridInputSelect] = useState<
    string | undefined
  >('')
  const [hybridInputText, sethybridInputText] = useState<string>(
    hybridInputSelect as string
  )

  const [newCustomerSelect, setNewCustomerSelect] = useState<CustomerSelect[]>()

  const pickedCustomer = customers.find(
    (item) =>
      concateFullName(item.firstName, item.lastName) === hybridInputSelect
  )

  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(hybridInputText.toLowerCase())
  )

  return (
    <FormContext.Provider
      value={{
        form,
        customers,
        hybridInputText,
        pickedCustomer,
        filteredOptions,
        hybridInputSelect,
        setHybridInputSelect,
        setNewCustomerSelect,
        sethybridInputText,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
