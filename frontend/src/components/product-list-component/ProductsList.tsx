import React, { useState, useEffect } from 'react'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProducts } from '@/model/response/IProductResponse'
import { Table, Input, Popconfirm, message, Modal, Form, InputNumber, Space, Button, Tooltip } from 'antd'
import { proizvod, proizvodjac, model, cena, kolicina, SKU } from './constats'
import ProductsAdvancedActions from './actions'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const { handleEdit, handleDelete, handleSave } = ProductsAdvancedActions()

const ProductsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  //Product set title
  useEffect(() => {
    setHeaderTitle('Proizvodi')
  }, [])

  const { allProducts } = useGetAllProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([])
  const [editingProduct, setEditingProduct] = useState<IProducts>({} as IProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormProductList] = Form.useForm<IProducts>()

  //Product update list on search/product change another useEffect in AllProducts

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const searchText = searchTerm.toLowerCase()
      return (
        product.name?.toLowerCase().includes(searchText) ||
        product.manufacturer?.toLowerCase().includes(searchText) ||
        product.model?.toLowerCase().includes(searchText) ||
        product.SKU?.toLowerCase().includes(searchText)
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
    SKU,

    {
      title: <div className="text-center">Radnje</div>,
      key: 'action',
      render: (record: IProducts) => (
        <Space size="large" className="flex justify-center gap-12">
          <Tooltip title="Izmeni">
            <Button
              type="primary"
              ghost
              onClick={() => handleEdit(record, setEditingProduct, FormProductList, setIsModalOpen)}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Da li ste sigurni da zelite da obrisete ovaj proizvod?"
            onConfirm={() => handleDelete(record.id, filteredProducts, setFilteredProducts)}
            onCancel={() => message.error('Brisanje proizvoda otkazano')}
          >
            <Tooltip title="Obrisi">
              <Button danger ghost>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className=" flex-row product">
      <Space id="search-container" className="col-span-12 flex product mt-2 pt-2">
        <Input.Search placeholder="Pretraži proizvode" onChange={(e) => setSearchTerm(e.target.value)} />
      </Space>
      <section className="w-full px-24 ">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{ pageSize: 6 }} // Adjust page size as needed
          rowKey="id" // Use 'id' as the row key
          className="product ml-12 mr-12 mt-6  border border-pink-300 p-2 rounded-xl "
        />
      </section>
      <Modal
        title="Uredi proizvod"
        open={isModalOpen}
        onOk={() => handleSave(FormProductList, editingProduct, filteredProducts, setFilteredProducts, setIsModalOpen)}
        onCancel={() => setIsModalOpen(false)}
        okText="Sacuvaj"
        cancelText="Otkazi"
        cancelButtonProps={{
          style: {
            backgroundColor: '#f5222d',
            color: '#fff',
          },
        }}
      >
        <Form form={FormProductList} layout="vertical" className="task">
          <Form.Item
            label="Naziv proizvoda"
            name="name"
            rules={[{ required: true, message: 'Please enter the product name' }]}
            className="mb-4"
          >
            <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item
            label="Proizvodjac"
            name="manufacturer"
            rules={[{ required: false, message: 'Molimo unesite proizvodjaca' }]}
            className="mb-4"
          >
            <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: false, message: 'Molimo unesite model proizvoda' }]}
            className="mb-4"
          >
            <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item
            label="Cena"
            name="price"
            rules={[{ required: true, message: 'Molimo unesite cenu proizvoda' }]}
            className="mb-4"
          >
            <InputNumber
              style={{ width: '100%' }}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            label="Kolicina"
            name="quantity"
            rules={[{ required: true, message: 'Molimo unesite kolicinu proizvoda' }]}
            className="mb-4"
          >
            <InputNumber
              style={{ width: '100%' }}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            label="SKU"
            name="SKU"
            rules={[{ required: true, message: 'Molimo unesite SKU proizvoda' }]}
            className="mb-4"
          >
            <Input
              style={{ width: '100%' }}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
        </Form>
      </Modal>
      {filteredProducts.length === 0 && (
        // <DrawerWithExtraActions />
        <Link to="/ProductCreate" className="text-center">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]"></h1>
        </Link>
      )}
    </div>
  )
}

export default ProductsList
