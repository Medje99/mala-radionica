import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React, { useEffect, useState } from 'react'
import { CustomerSelect } from './types'
import { FormInstance } from 'antd'
import ContactService from '@/service/ContactsService'

const contactFormActions = () => {
  const setCustomerSelectOptions = (
    customers: IContactsResponse[],
    setNewCustomerSelect: React.Dispatch<React.SetStateAction<CustomerSelect[] | undefined>>,
  ) => {
    const selectLabel = customers.map((item) => ({
      label: concateFullName(item.firstName, item.lastName),
      value: concateFullName(item.firstName, item.lastName),
    }))
    setNewCustomerSelect(selectLabel)
  }

  const setCustomerFormValues = (
    pickedCustomer: IContactsResponse | undefined,
    form: FormInstance<IContactsResponse>,
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

  const handleSelectChange = (
    pickedCustomer: string,
    setCurrentCustomer: React.Dispatch<React.SetStateAction<string | undefined>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setCurrentCustomer(pickedCustomer)
    setInputValue('')
  }
  const useGetAllContacts = () => {
    const [customers, setCustomers] = useState<IContactsResponse[]>([])

    useEffect(() => {
      ContactService.getAllCustomers()
        .then((response) => {
          setCustomers(response.data)
        })
        .catch((error) => {
          console.error('Error fetching contacts:', error)
        })
    }, [])

    return { customers }
  }

  return {
    setCustomerSelectOptions,
    setCustomerFormValues,
    handleSelectChange,
    useGetAllContacts,
  }
}

export default contactFormActions
