import { baseUrl } from '@/constants/Constants'
import axios from 'axios'

export interface IBillResponse {
  id: number // The unique identifier for the bill
  contact_id: number // The ID of the contact associated with the bill
  job_id: number // The ID of the job associated with the bill
  end_date: string | null // The end date of the job/bill, can be null
  labor_cost: number // The cost of labor associated with the bill
  paid: boolean // A flag indicating whether the bill has been paid
  parts_cost?: number // The total cost of the bill, including labor and products used
  products_used: products[] // A string listing the products used (this could be an array or JSON if needed)
}

interface products {
  product: number
  quantity: number
  name?: string
}

const createBill = async (data: IBillResponse) => {
  return await axios.post<IBillResponse>(baseUrl + '/bill', data)
}

const getAllBills = async () => {
  return await axios.get<IBillResponse[]>(baseUrl + '/bills') // Adjusted endpoint to plural '/bills'
}

const getBillById = async (id: number) => {
  return await axios.get<IBillResponse>(`${baseUrl}/bills/${id}`) // Adjusted endpoint to plural '/bills'
}

const updateBill = async (data: IBillResponse) => {
  return await axios.put<IBillResponse>(`${baseUrl}/bill/${data.id}`, data) // Using bill_id as the identifier
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
