import React, { useState, useEffect } from 'react'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProducts } from '@/model/response/IProductResponse'
import {
  Table,
  Typography,
  Input,
  Popconfirm,
  message,
  Modal,
  Form,
  InputNumber,
  Space,
  Button,
} from 'antd'

//Products with Edit functionality not affecting DATABASE !

const ProductsAdvanced: React.FC = () => {
  const { customers: allProducts } = useGetAllProducts() // Use the hook
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([])
  const [editingProduct, setEditingProduct] = useState<IProducts | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const searchText = searchTerm.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchText) ||
        product.manufacturer.toLowerCase().includes(searchText) ||
        product.model.toLowerCase().includes(searchText)
      )
    })
    setFilteredProducts(filtered)
  }, [searchTerm, allProducts])

  const columns = [
    {
      title: 'Proizvod',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Proizvodjac',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      editable: true,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      editable: true,
    },
    {
      title: 'Cena',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      render: (price: number) => `$${price.toFixed(2)}`, // Format price
    },
    {
      title: 'Kolicina',
      dataIndex: 'quantity',
      key: 'quantitiy',
      editable: true,
    },
    {
      title: 'Izmeni',
      key: 'action',
      render: (text: any, record: IProducts) => (
        <Space size="large">
          <Button type="primary" ghost onClick={() => handleEdit(record)}>
            Izmeni
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            onCancel={() => message.error('Delete canceled')}
          >
            <Button danger ghost>
              Obrisi
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleEdit = (record: IProducts) => {
    setEditingProduct({ ...record })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    // Implement your delete logic here (e.g., call an API to delete the product)
    message.success('Product deleted successfully')
    setFilteredProducts(filteredProducts.filter((product) => product.id !== id))
  }

  const handleSave = async (record: IProducts) => {
    // Implement your save logic here (e.g., call an API to update the product)
    message.success('Product updated successfully')
    setFilteredProducts(
      filteredProducts.map((product) =>
        product.id === record.id ? record : product
      )
    )
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof IProducts
  ) => {
    setEditingProduct((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleInputNumberChange = (value: number, key: keyof IProducts) => {
    setEditingProduct((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <Typography.Title level={1} className="mb-2">
        Proizvodi:
      </Typography.Title>
      <hr />

      <Input.Search
        placeholder="Pretraži proizvode"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredProducts}
        pagination={{ pageSize: 7 }} // Adjust page size as needed
        rowKey="id" // Use 'id' as the row key
      />

      <Modal
        title="Edit Product"
        open={isModalOpen}
        onOk={() => handleSave(editingProduct!)}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              value={editingProduct?.name || ''}
              onChange={(e) => handleInputChange(e, 'name')}
            />
          </Form.Item>
          <Form.Item label="Manufacturer">
            <Input
              value={editingProduct?.manufacturer || ''}
              onChange={(e) => handleInputChange(e, 'manufacturer')}
            />
          </Form.Item>
          <Form.Item label="Model">
            <Input
              value={editingProduct?.model || ''}
              onChange={(e) => handleInputChange(e, 'model')}
            />
          </Form.Item>
          <Form.Item label="Price">
            <InputNumber
              value={editingProduct?.price || 0}
              onChange={(value) => handleInputNumberChange(value, 'price')}
            />
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber
              value={editingProduct?.quantity || 0}
              onChange={(value) => handleInputNumberChange(value, 'quantity')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductsAdvanced
