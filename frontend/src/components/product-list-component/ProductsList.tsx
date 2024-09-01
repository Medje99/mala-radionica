import React, { useState, useEffect } from 'react'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProducts } from '@/model/response/IProductResponse'
import { Table, Input, Popconfirm, message, Modal, Form, InputNumber, Space, Button } from 'antd'
import { proizvod, proizvodjac, model, cena, kolicina } from './constats'
import ProductsAdvancedActions from './actions'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { PlusCircleOutlined } from '@ant-design/icons'

const { handleEdit, handleDelete, handleSave } = ProductsAdvancedActions()

const ProductsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Proizvodi')
  }, [])
  const { allProducts } = useGetAllProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([])
  const [editingProduct, setEditingProduct] = useState<IProducts>({} as IProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormProductList] = Form.useForm<IProducts>()

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
    proizvod,
    proizvodjac,
    model,
    cena,
    kolicina,
    {
      title: <div className="text-center">Radnje</div>,
      key: 'action',
      render: (record: IProducts) => (
        <Space size="large" className="flex justify-center gap-12">
          <Button
            type="primary"
            ghost
            onClick={() => handleEdit(record, setEditingProduct, FormProductList, setIsModalOpen)}
          >
            Izmeni
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id, filteredProducts, setFilteredProducts)}
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

  return (
    <div className="flex flex-col ">
      <div className="flex w-full ">
        <Input.Search placeholder="Pretraži proizvode" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        pagination={{ pageSize: 7 }} // Adjust page size as needed
        rowKey="id" // Use 'id' as the row key
        className="w-full ml-12"
      />

      <Modal
        title="Uredi proizvod"
        open={isModalOpen}
        onOk={() => handleSave(FormProductList, editingProduct, filteredProducts, setFilteredProducts, setIsModalOpen)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={FormProductList} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the product name' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Manufacturer"
            name="manufacturer"
            rules={[{ required: true, message: 'Please enter the manufacturer name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Model" name="model" rules={[{ required: true, message: 'Please enter the product model' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the product price' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter the product quantity' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      {filteredProducts.length === 0 && (
        <Link to="/ProductCreate" className="text-center">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Dodaj proizvod
          </h1>
        </Link>
      )}
    </div>
  )
}

export default ProductsList
