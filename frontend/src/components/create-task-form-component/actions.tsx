import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React from 'react'
import { CustomerSelect } from './types'
import { FormInstance } from 'antd'

const createTaskFormActions = () => {
  const setCustomerSelectOptions = (
    customers: IContacts[],
    setNewCustomerSelect: React.Dispatch<
      React.SetStateAction<CustomerSelect[] | undefined>
    >
  ) => {
    const selectLabel = customers.map((item) => ({
      label: concateFullName(item.firstName, item.lastName),
      value: concateFullName(item.firstName, item.lastName),
    }))
    setNewCustomerSelect(selectLabel)
  }

  const setCustomerFormValues = (
    customers: IContacts[],
    currentCustomer: string | undefined,
    form: FormInstance<IContacts>,
    setNewCustomer: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const customer = customers.find(
      (item) =>
        concateFullName(item.firstName, item.lastName) === currentCustomer
    )
    if (customer) {
      setNewCustomer(false)
      form.setFieldsValue({
        phoneNumber: customer?.phoneNumber || 0,
        city: customer?.city || '',
        address: customer?.address || '',
        other: customer?.other || '',
      })
    } else {
      setNewCustomer(true)
      form.resetFields(['phoneNumber', 'city', 'address', 'other'])
    }
  }

  // Handles selection changes
  const handleSelectChange = (
    value: string | undefined,
    setCurrentCustomer: React.Dispatch<
      React.SetStateAction<string | undefined>
    >,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setCurrentCustomer(value)
    setInputValue('')
  }

  // Handles input changes
  const handleInputChange = (
    value: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setInputValue(value)
  }

  return {
    setCustomerSelectOptions,
    setCustomerFormValues,
    handleSelectChange,
    handleInputChange,
  }
}

export default createTaskFormActions
