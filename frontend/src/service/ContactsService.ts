import { baseUrl } from '@/constants/Constants'
import { IContacts } from '@/model/response/IContactResponse'
import axios from 'axios'

const getAllCustomers = async () => {
  return await axios.get<IContacts[]>(baseUrl + '/contacts')
}
const ContactService = {
  getAllCustomers,
}

export default ContactService
