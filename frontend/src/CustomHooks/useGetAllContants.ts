import { IContacts } from '@/model/response/IContactResponse'
import ContactService from '@/service/ContactsService'
import { useEffect, useState } from 'react'

const useGetAllContacts = () => {
  const [customers, setCustomers] = useState<IContacts[]>([])

  useEffect(() => {
    const getContacts = async () => {
      try {
        ContactService.getAllCustomers().then((response) => {
          setCustomers(response.data)
        })
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    }

    getContacts()
  }, [])

  return { customers }
}

export default useGetAllContacts
