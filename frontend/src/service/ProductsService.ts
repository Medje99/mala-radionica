import { baseUrl } from '@/constants/Constants'
import { IProducts } from '@/model/response/IProductResponse'
import axios from 'axios'

const getAllProducts = async () => {
  return await axios.get<IProducts[]>(baseUrl + '/Products')
}

const createProductEntry = async (data: any) => {
  return await axios.post<IProducts[]>(baseUrl + '/Products', data)
}

const ProductsService = {
  getAllProducts,
}

export default ProductsService
