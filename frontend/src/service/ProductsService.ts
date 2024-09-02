import { baseUrl } from '@/constants/Constants'
import { IProducts } from '@/model/response/IProductResponse'
import axios from 'axios'

const getAllProducts = async () => {
  return await axios.get<IProducts[]>(baseUrl + '/Products')
}

const createProductEntry = async (data: IProducts) => {
  return await axios.post<IProducts[]>(baseUrl + '/Products', data)
}

const updateProduct = async (data: IProducts) => {
  return await axios.put<IProducts[]>(baseUrl + '/Products/' + data.id, data).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const deleteProduct = async (id: number) => {
  return await axios.delete<IProducts[]>(baseUrl + '/Products/' + id)
}

const getProductById = async (id: string | number) => {
  try {
    const response = await axios.get<IProducts>(`${baseUrl}/Products/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error // You can handle the error as needed
  }
}

const updateMultipleProducts = async (productsToUpdate: { id: number; quantity: number }[]) => {
  try {
    const response = await axios.put<IProducts[]>(`${baseUrl}/Products/updateMultiple`, productsToUpdate)
    return response.data
  } catch (error) {
    console.error('Error updating multiple products:', error)
    throw error
  }
}

const ProductsService = {
  getAllProducts,
  createProductEntry,
  updateProduct,
  deleteProduct,
  getProductById,
  updateMultipleProducts,
}

export default ProductsService
