import { baseUrl } from '@/constants/Constants'
import { IProducts } from '@/model/response/IProductResponse'
import axios from 'axios'

const getAllProducts = async () => {
  return await axios.get<IProducts[]>(baseUrl + '/Products')
}
const ProductsService = {
  getAllProducts,
}

export default ProductsService
