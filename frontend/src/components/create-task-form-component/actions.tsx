import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React from 'react'
import { CustomerSelect } from './types'

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

  return { setCustomerSelectOptions }
}

export default createTaskFormActions
