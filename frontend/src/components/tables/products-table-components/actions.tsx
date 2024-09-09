import { IProduct } from '@/model/response/IProductResponse'
import ProductsService from '@/services/ProductsService'
import { FormInstance, message } from 'antd'
import { useEffect, useState } from 'react'

const useGetAllProducts = () => {
  const [allProducts, setAllProducts] = useState<IProduct[]>([])

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

const handleEdit = (
  record: IProduct,
  setEditingProduct: React.Dispatch<React.SetStateAction<IProduct>>,
  form: FormInstance<IProduct>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setEditingProduct({ ...record })
  form.setFieldsValue({
    ...record,
  })
  setIsModalOpen(true)
}

const handleDelete = (
  id: number,
  filteredProducts: IProduct[],
  setFilteredProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
) => {
  ProductsService.deleteProduct(id)
    .then(() => {
      message.success('Proizvod uspesno obrisan!')
      setFilteredProducts(filteredProducts.filter((product) => product.id !== id))
    })
    .catch((error) => {
      console.error('Error deleting product:', error)
      message.error('Greška prilikom brisanja proizvoda! Kontaktirajte administratora.')
    })
}
const handleSave = async (
  form: FormInstance<IProduct>,
  editingProduct: IProduct | null,
  filteredProducts: IProduct[],
  setFilteredProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const values = await form.validateFields()
    const updatedProduct = { ...editingProduct, ...values } as IProduct
    const response = await ProductsService.updateProduct(updatedProduct)
    if (response.status === 200) {
      message.success('Proizvod uspesno izmenjen!')
      setFilteredProducts(
        filteredProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
      )
      setIsModalOpen(false)
    } else {
      // Handle error cases (e.g., display an error message)
      console.error('Error updating product:', response)
      message.error('Greška prilikom izmene proizvoda! Molimo kontaktirajte administratora.')
    }
  } catch (error) {
    console.error('Validation failed:', error)
    message.error('Greška prilikom izmene proizvoda! Molimo kontaktirajte administratora!')
  }
}

export { useGetAllProducts, handleEdit, handleDelete, handleSave }
