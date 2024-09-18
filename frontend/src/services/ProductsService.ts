import { baseUrl } from '@/Constants'
import { IProduct } from '@/model/response/IProductResponse'
import axios from 'axios'

const getAllProducts = async () => {
  return await axios.get<IProduct[]>(baseUrl + '/Products')
}

const createProductEntry = async (data: IProduct) => {
  return await axios.post<IProduct[]>(baseUrl + '/Products', data)
}

const updateProduct = async (data: IProduct) => {
  return await axios.put<IProduct[]>(baseUrl + '/Products/' + data.id, data).catch((error) => {
    throw axios.isAxiosError(error) ? error.response?.data : error
  })
}

const deleteProduct = async (id: number) => {
  return await axios.delete<IProduct[]>(baseUrl + '/Products/' + id)
}

const getProductById = async (id: string | number) => {
  try {
    const response = await axios.get<IProduct>(`${baseUrl}/Products/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error // You can handle the error as needed
  }
}

const updateMultipleProducts = async (productsToUpdate: { id: number; quantity: number }[]) => {
  try {
    const response = await axios.put<IProduct[]>(`${baseUrl}/Products/updateMultiple`, productsToUpdate)
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
