import { IContactsResponse } from '@/model/response/IContactResponse'
import ContactService from '@/service/ContactsService'
import { useEffect, useState } from 'react'

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

export default useGetAllContacts
