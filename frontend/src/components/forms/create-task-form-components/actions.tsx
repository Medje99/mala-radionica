import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React, { useEffect, useState } from 'react'
import { ContactSelect } from './types'
import { FormInstance } from 'antd'
import ContactService from '@/services/ContactsService'

const contactFormActions = () => {
  const setContactSelectOptions = (
    contacts: IContactsResponse[], // prop list of all contact
    setNewContactSelect: React.Dispatch<React.SetStateAction<ContactSelect[] | undefined>>, // prop
  ) => {
    const selectLabel = contacts.map((item) => ({
      label: concateFullName(item.firstName, item.lastName),
      value: concateFullName(item.firstName, item.lastName),
    }))
    setNewContactSelect(selectLabel)
  }

  const setContactFormValues = (
    pickedContact: IContactsResponse | undefined,
    form: FormInstance<IContactsResponse>,
    setNewContact: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (pickedContact) {
      setNewContact(false)
      form.setFieldsValue({
        phoneNumber: pickedContact?.phoneNumber || '',
        city: pickedContact?.city || '',
        address: pickedContact?.address || '',
        other: pickedContact?.other || '',
      })
    } else {
      setNewContact(true)
      form.resetFields(['phoneNumber', 'city', 'address', 'other'])
    }
  }

  const handleSelectChange = (
    pickedContact: string,
    setCurrentContact: React.Dispatch<React.SetStateAction<string | undefined>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setCurrentContact(pickedContact)
    setInputValue('')
  }
  const useGetAllContacts = () => {
    const [allContacts, setAllContacts] = useState<IContactsResponse[]>([])

    useEffect(() => {
      ContactService.getAllContacts()
        .then((response) => {
          setAllContacts(response.data)
        })
        .catch((error) => {
          console.error('Error fetching contacts:', error)
        })
    }, [])

    return { allContacts }
  }

  return {
    setContactSelectOptions,
    setContactFormValues,
    handleSelectChange,
    useGetAllContacts,
  }
}

export default contactFormActions
