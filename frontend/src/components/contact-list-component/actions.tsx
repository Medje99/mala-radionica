import { IContactsResponse } from '@/model/response/IContactResponse'
import ContactService from '@/service/ContactsService'
import { message, FormInstance } from 'antd'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'react-router-dom' // Adjust path if needed

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
  ContactService.deleteContactCustomer(id)
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
    await ContactService.updateContactCustomer(updatedContact) // Wait for update to complete

    // Update the state after successful update
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

export { handleEdit, handleDelete, handleSave }
