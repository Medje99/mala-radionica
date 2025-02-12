import React, { useState, useEffect } from 'react'
import { IProduct } from '@/model/response/IProductResponse'
import { Input, Popconfirm, message, Modal, Form, InputNumber, Space, Button, Tooltip, Table } from 'antd'
import { proizvod, proizvodjac, model, cena, kolicina, SKU } from './constats'
import { useGetAllProducts, handleEdit, handleDelete, handleSave } from './actions'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import CreateNewProductForm from '@/components/forms/create-product-form/createNewProductForm'


const ProductsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  //Product set title
  useEffect(() => {
    setHeaderTitle('Proizvodi')
  }, [])

  const { allProducts } = useGetAllProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<IProduct>({} as IProduct)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormProductList] = Form.useForm<IProduct>()

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
    SKU, // ✅ Keeping SKU and Kolicina together
    {
      align: 'center',
      title: 'Kolicina',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => {
        return (
          <Space className="flex justify-center w-full ">
            <Button
              className='px-10'
              type="primary"
              style={{
                backgroundColor: quantity > 0 ? 'green' : 'red',
                borderColor: quantity > 0 ? 'green' : 'red',
              }}
            >
              {quantity}
            </Button>
          </Space>
        );
      },
  
      filters: [
        { text: 'Na stanju', value: 1 },
        { text: 'Nema na stanju', value: 0 },
      ],
      onFilter: (value: boolean | Key, record: IProduct) => (record.quantity > 0 ? 1 : 0) === value,
    },
  
    // ✅ Existing "Akcije" (Actions) Column
    {
      align: 'center',
      title: 'Akcije',
      key: 'action',
      render: (record: IProduct) => (
        <Space size="large" className="flex justify-center lg:gap-10 gap-2">
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
            okText="Da"
            cancelText="Ne"
            okButtonProps={{ style: { background: 'green' } }}
            cancelButtonProps={{ style: { background: 'red' } }}
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
  ];

  //const ProductList: React.FC<ProductProps> = ({ allProducts }) => {
  // Calculate the total price
  const totalPrice = allProducts.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  const totalQuantity = allProducts.reduce((total, product) => {
    return total + (product.quantity);
  }, 0);

  return (
    <div className="flex flex-row product h-[calc(100vh-6rem)] overflow-y-auto bg-gradient-to-r from-amber-200 to-yellow-500">
      {/* Left Side: CreateNewProductForm */}
      <div className="w-1/4 p-4">
        <CreateNewProductForm />
      </div>
  
      {/* Right Side: List and Search */}
      <div className="w-3/4 p-4">
        <Space id="search-container" className="col-span-12 flex">
          <Input.Search
            size="large"
            placeholder="Pretraži proizvode"
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search"
          />
        </Space>
  
        <section className="w-full lg:px-24">
          <Table
            size="small"
            columns={columns} // don't like align center
            dataSource={filteredProducts}
            pagination={{
              pageSize: 13,
              showSizeChanger: false,
              showTotal: (total) => `Ukupno ${total} proizvoda`,
            }} // Adjust page size as needed
            rowKey="id" // Use 'id' as the row key
            className="lg:p-7 mt-5 rounded-xl"
          />
  
          <div>
            <h2>Total Price of All Products {totalPrice.toLocaleString() + " RSD"}</h2>
            <h2>Total Price of All Products {Math.round(totalPrice / 117).toLocaleString() + " EUR"}</h2>
            <h2>Total Quantity of All Products {totalQuantity.toLocaleString()}</h2>
          </div>
        </section>
  
        {/* Task Edit Modal */}
        <Modal
          className="flex"
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
              rules={[{ required: true, message: 'Popuni naziv posla!' }]}
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
              required
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
          <Link to="/ProductCreate" className="text-center">
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              Dodaj novi proizvod
            </h1>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProductsList
