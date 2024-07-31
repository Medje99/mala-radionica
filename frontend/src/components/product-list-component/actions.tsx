/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { FormInstance, message } from 'antd'

const ProductsAdvancedActions = () => {
  const handleEdit = (
    record: IProducts,
    setEditingProduct: React.Dispatch<React.SetStateAction<IProducts>>,
    form: FormInstance<IProducts>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setEditingProduct({ ...record })
    form.setFieldsValue({
      ...record,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (
    id: number,
    filteredProducts: IProducts[],
    setFilteredProducts: React.Dispatch<React.SetStateAction<IProducts[]>>
  ) => {
    // Implement your delete logic here (e.g., call an API to delete the product)
    message.success('Product deleted successfully')
    ProductsService.deleteProduct(id)
    setFilteredProducts(filteredProducts.filter((product) => product.id !== id))
  }

  const handleSave = async (
    form: FormInstance<IProducts>,
    editingProduct: IProducts | null,
    filteredProducts: IProducts[],
    setFilteredProducts: React.Dispatch<React.SetStateAction<IProducts[]>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const values = await form.validateFields()
      const updatedProduct = { ...editingProduct, ...values } as IProducts
      ProductsService.updateProduct(updatedProduct)
      message.success('Product updated successfully')
      setFilteredProducts(
        filteredProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      )
      setIsModalOpen(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return { handleEdit, handleDelete, handleSave }
}

export default ProductsAdvancedActions
