import { baseUrl } from '@/Constants'
import axios from 'axios'
import { IBillResponse } from '@/model/response/IBillResponse'

// billing task post
const createBill = async (data: IBillResponse) => {
  return await axios.post<IBillResponse>(baseUrl + '/bills', data).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

// get bill list
const getAllBills = async () => {
  return await axios.get<IBillResponse[]>(baseUrl + '/bills').catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

//to be implemented
const getBillById = async (id: number) => {
  return await axios.get<IBillResponse>(`${baseUrl}/bills/${id}`).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

//to be implemented
const updateBill = async (data: IBillResponse) => {
  return await axios
    .put<IBillResponse>(`${baseUrl}/bills/${data.bill_id}`, data)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw axios.isAxiosError(error) ? error.response?.data : error
    })
}

// delete bill service
const deleteBill = async (id: number) => {
  return await axios.delete(`${baseUrl}/bills/${id}`).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const markAsPaid = async (id: number) => {
  return await axios.put(`${baseUrl}/bills/${id}`).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const productQUpdate = async (data: any) => {
  return await axios.post<any>(baseUrl + '/quantitySubtract', data).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const BillService = {
  markAsPaid,
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  productQUpdate,
}

export default BillService
