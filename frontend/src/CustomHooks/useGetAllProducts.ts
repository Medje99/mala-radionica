import { IProducts as IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { useEffect, useState } from 'react'

const useGetAllProducts = () => {
  const [products, setProducts] = useState<IProducts[]>([])

  useEffect(() => {
    const getProducts = async () => {
      try {
        ProductsService.getAllProducts().then((response) => {
          setProducts(response.data)
        })
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getProducts()
  }, [])

  return { customers: products }
}

export default useGetAllProducts
