/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from '@/Constants'
import { IContactsResponse } from '@/model/response/IContactResponse'
import axios from 'axios'

const getAllContacts = async () => {
  return await axios.get<IContactsResponse[]>(baseUrl + '/contacts').catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const createContact = async (data: IContactsResponse) => {
  return await axios.post<IContactsResponse>(baseUrl + '/contacts', data)
}

const updateContact = async (data: IContactsResponse) => {
  return await axios.put<IContactsResponse>(baseUrl + '/contacts/' + data.id, data).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const deleteContact = async (id: number) => {
  return await axios.delete<IContactsResponse>(baseUrl + '/contacts/' + id).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const ContactService = {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
}

export default ContactService
