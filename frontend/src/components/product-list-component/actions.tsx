/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { FormInstance, message } from 'antd'

const ProductsActions = () => {
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
    message.success('Proizvod uspesno obrisan!')
    ProductsService.deleteProduct(id)
    setFilteredProducts(filteredProducts.filter((product) => product.id !== id))
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
      ProductsService.updateProduct(updatedProduct)
      message.success('Proizvod uspesno izmenjen!')
      setFilteredProducts(
        filteredProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
      )
      setIsModalOpen(false)
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Greska prilikom izmene proizvoda,molimo kontaktirajte administratora!')
    }
  }

  return { handleEdit, handleDelete, handleSave }
}

export default ProductsActions
