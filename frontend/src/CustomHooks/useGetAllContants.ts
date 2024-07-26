import { IContacts } from '@/model/response/IContactResponse'
import ContactService from '@/service/ContactsService'
import { useEffect, useState } from 'react'

const useGetAllContacts = () => {
  const [customers, setCustomers] = useState<IContacts[]>([])

  useEffect(() => {
    const getContacts = async () => {
      try {
        ContactService.getAllCustomers().then((response) => {
          const customers = response.data.map((item) => ({
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            phoneNumber: item.phoneNumber,
            city: item.city,
            address: item.address,
            other: item.other,
          }))

          setCustomers(customers)
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
