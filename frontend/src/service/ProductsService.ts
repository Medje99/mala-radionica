import { baseUrl } from '@/constants/Constants'
import { IProducts } from '@/model/response/IProductResponse'
import axios from 'axios'

const getAllProducts = async () => {
  return await axios.get<IProducts[]>(baseUrl + '/Products')
}

const createProductEntry = async (data: IProducts) => {
  return await axios.post<IProducts[]>(baseUrl + '/ProductInput', data)
}

const updateProduct = async (data: IProducts) => {
  return await axios.put<IProducts[]>(baseUrl + '/Products/' + data.id, data)
}

const deleteProduct = async (id: number) => {
  return await axios.delete<IProducts[]>(baseUrl + '/Products/' + id)
}

const ProductsService = {
  getAllProducts,
  createProductEntry,
  updateProduct,
  deleteProduct,
}

export default ProductsService
