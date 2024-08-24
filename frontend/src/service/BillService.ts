import { baseUrl } from '@/constants/Constants'
import axios from 'axios'
import { IBillResponse } from '@/model/response/IBillResponse'

// for existing task
const createBill = async (data: IBillResponse) => {
  return await axios.post<IBillResponse>(baseUrl + '/bill', data)
}
// ok
const getAllBills = async () => {
  return await axios.get<IBillResponse[]>(baseUrl + '/bills') // Adjusted endpoint to plural '/bills'
}

const getBillById = async (id: number) => {
  return await axios.get<IBillResponse>(`${baseUrl}/bills/${id}`) // Adjusted endpoint to plural '/bills'
}

const updateBill = async (data: IBillResponse) => {
  return await axios.put<IBillResponse>(`${baseUrl}/bill/${data.bill_id}`, data).then((response) => {
    return response.data
  }) // Using bill_id as the identifier
}

const deleteBill = async (id: number) => {
  return await axios.delete(`${baseUrl}/bill/${id}`)
}

const BillService = {
  createBill,
  getAllBills,
  getBillById, // Added getBillById method
  updateBill,
  deleteBill,
}

export default BillService
