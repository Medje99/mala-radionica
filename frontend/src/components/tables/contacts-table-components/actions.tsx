import { IContactsResponse } from '@/model/response/IContactResponse'
import ContactService from '@/services/ContactsService'
import { message, FormInstance } from 'antd'
import { AxiosError } from 'axios'
import { useState, useEffect } from 'react'
import { ErrorResponse } from 'react-router-dom' // Adjust path if needed

const useGetAllContacts = () => {
  const [contacts, setContacts] = useState<IContactsResponse[]>([])

  useEffect(() => {
    ContactService.getAllContacts()
      .then((response) => {
        setContacts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error)
      })
  }, [])

  return { contacts }
}

const handleEdit = (
  record: IContactsResponse,
  setEditingContact: React.Dispatch<React.SetStateAction<IContactsResponse>>,
  form: FormInstance<IContactsResponse>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setEditingContact(record)
  form.setFieldsValue(record)
  setIsModalOpen(true)
}

const handleDelete = (
  id: number,
  filteredContacts: IContactsResponse[],
  setFilteredContacts: React.Dispatch<React.SetStateAction<IContactsResponse[]>>,
) => {
  ContactService.deleteContact(id)
    .then(() => {
      message.success('Kontakt izbrisan')
      setFilteredContacts(filteredContacts.filter((contact) => contact.id !== id))
    })
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error('Error deleting contact:', error)
      message.error('Kontakt nije obrisan.')
      message.warning('Nije dozvoljeno obrisati kontakt za koji postoji aktivan posao!')
    })
}

const handleSave = async (
  form: FormInstance<IContactsResponse>,
  editingContact: IContactsResponse,
  filteredContacts: IContactsResponse[],
  setFilteredContacts: React.Dispatch<React.SetStateAction<IContactsResponse[]>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const values = await form.validateFields()
    const updatedContact = { ...editingContact, ...values } as IContactsResponse
    await ContactService.updateContact(updatedContact) // Wait for update to complete

    // Update the state after successful save need
    const updatedContacts = filteredContacts.map((contact) =>
      contact.id === editingContact.id ? updatedContact : contact,
    )
    setFilteredContacts(updatedContacts)
    setIsModalOpen(false)

    message.success('Kontakt izmenjen uspesno!')
  } catch (error) {
    console.error('Error updating contact:', error)
    message.error('Greska prilikom izmene kontakt, kontaktirajte administratora.')
  }
}

export { handleEdit, handleDelete, handleSave, useGetAllContacts }
