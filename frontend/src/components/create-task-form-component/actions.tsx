import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React from 'react'
import { CustomerSelect } from './types'
import { FormInstance } from 'antd'

const contactFormActions = () => {
  const setCustomerSelectOptions = (
    customers: IContacts[],
    setNewCustomerSelect: React.Dispatch<React.SetStateAction<CustomerSelect[] | undefined>>,
  ) => {
    const selectLabel = customers.map((item) => ({
      label: concateFullName(item.firstName, item.lastName),
      value: concateFullName(item.firstName, item.lastName),
    }))
    setNewCustomerSelect(selectLabel)
  }

  const setCustomerFormValues = (
    pickedCustomer: IContacts | undefined,
    form: FormInstance<IContacts>,
    setNewCustomer: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (pickedCustomer) {
      setNewCustomer(false)
      form.setFieldsValue({
        phoneNumber: pickedCustomer?.phoneNumber || '',
        city: pickedCustomer?.city || '',
        address: pickedCustomer?.address || '',
        other: pickedCustomer?.other || '',
      })
    } else {
      setNewCustomer(true)
      form.resetFields(['phoneNumber', 'city', 'address', 'other'])
    }
  }

  // Handles selection changes
  const handleSelectChange = (
    pickedCustomer: string,
    setCurrentCustomer: React.Dispatch<React.SetStateAction<string | undefined>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setCurrentCustomer(pickedCustomer)
    setInputValue('')
  }

  return {
    setCustomerSelectOptions,
    setCustomerFormValues,
    handleSelectChange,
  }
}

export default contactFormActions
