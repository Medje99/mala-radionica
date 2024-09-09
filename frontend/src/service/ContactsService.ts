/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from '@/Constants'
import { IContactsResponse } from '@/model/response/IContactResponse'
import axios from 'axios'

const getAllCustomers = async () => {
  return await axios.get<IContactsResponse[]>(baseUrl + '/contacts')
}

const createContactCustomer = async (data: IContactsResponse) => {
  return await axios.post<IContactsResponse>(baseUrl + '/contacts', data)
}

const updateContactCustomer = async (data: IContactsResponse) => {
  return await axios.put<IContactsResponse>(baseUrl + '/contacts/' + data.id, data)
}

const deleteContactCustomer = async (id: number) => {
  return await axios.delete<IContactsResponse>(baseUrl + '/contacts/' + id).catch((error) => {
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
