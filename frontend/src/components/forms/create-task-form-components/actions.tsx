import { IContactsResponse } from '@/model/response/IContactResponse'
import { useEffect, useState } from 'react'

import ContactService from '@/services/ContactsService'

const contactFormActions = () => {
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
    useGetAllContacts,
  }
}

export default contactFormActions
