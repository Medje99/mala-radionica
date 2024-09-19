import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import React, { useEffect, useState } from 'react'
import { VLI } from './types'
import { FormInstance } from 'antd'
import ContactService from '@/services/ContactsService'

const contactFormActions = () => {
  const cutToVLI = (
    contacts: IContactsResponse[], // prop list of all contact full object
    setVLI: React.Dispatch<React.SetStateAction<VLI[] | undefined>>, // prop
  ) => {
    const VLI = contacts.map((item) => ({
      label: item.id.toLocaleString(), // label and
      value: concateFullName(item.firstName, item.lastName), // value same cut one ?
      id: item.id,
    }))
    setVLI(VLI) // contact list cut to Value Label id
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
    cutToVLI,
    setContactFormValues,
    handleSelectChange,
    useGetAllContacts,
  }
}

export default contactFormActions
