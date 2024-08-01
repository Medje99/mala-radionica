import { IProducts as IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { useEffect, useState } from 'react'

const useGetAllProducts = () => {
  const [allProducts, setAllProducts] = useState<IProducts[]>([])

  useEffect(() => {
    ProductsService.getAllProducts()
      .then((response) => {
        setAllProducts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])

  return { allProducts }
}

export default useGetAllProducts
