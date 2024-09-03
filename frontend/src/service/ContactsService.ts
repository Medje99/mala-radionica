/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from '@/constants/Constants'
import { IContacts } from '@/model/response/IContactResponse'
import axios from 'axios'

const getAllCustomers = async () => {
  return await axios.get<IContacts[]>(baseUrl + '/contacts')
}

const createContactCustomer = async (data: IContacts) => {
  return await axios.post<IContacts>(baseUrl + '/contacts', data)
}

const updateContactCustomer = async (data: IContacts) => {
  return await axios.put<IContacts>(baseUrl + '/contacts/' + data.id, data)
}

const deleteContactCustomer = async (id: number) => {
  return await axios.delete<IContacts>(baseUrl + '/contacts/' + id).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const ContactService = {
  getAllCustomers,
  createContactCustomer,
  updateContactCustomer,
  deleteContactCustomer,
}

export default ContactService
