/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from '@/constants/Constants'
import { IContacts } from '@/model/response/IContactResponse'
import axios from 'axios'

const getAllCustomers = async () => {
  return await axios.get<IContacts[]>(baseUrl + '/contacts')
}

const createContactCustomer = async (data: any) => {
  return await axios.post<IContacts[]>(baseUrl + '/contacts', data)
}
const ContactService = {
  getAllCustomers,
  createContactCustomer,
}

export default ContactService
