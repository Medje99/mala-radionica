import React, { useState, useEffect, useCallback } from 'react'
import { IProduct } from '@/model/response/IProductResponse'
import { Input, Popconfirm, message, Modal, Form, InputNumber, Space, Button, Tooltip, Table, Card, Dropdown } from 'antd'
import { useGetAllProducts, handleEdit, handleDelete, handleSave } from './actions'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import CreateNewProductForm from '@/components/forms/create-product-form/createNewProductForm'
import { ColumnsType } from 'antd/es/table'
import { debounce } from 'lodash'

interface ProductSummary {
  totalPriceRSD: number
  totalPriceEUR: number
  totalQuantity: number
}

const ProductsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  
  // Set page title
  useEffect(() => {
    setHeaderTitle('Proizvodi')
    return () => setHeaderTitle('')
  }, [setHeaderTitle])

  const { allProducts, loading, error } = useGetAllProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<IProduct>({} as IProduct)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formProductList] = Form.useForm<IProduct>()

  // Show error message if API fails
  useEffect(() => {
    if (error) {
      message.error('Došlo je do greške pri učitavanju proizvoda')
    }
  }, [error])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string, products: IProduct[]) => {
      const filtered = products.filter((product) => {
        const searchText = term.toLowerCase()
        return (
          product.name?.toLowerCase().includes(searchText) ||
          product.manufacturer?.toLowerCase().includes(searchText) ||
          product.model?.toLowerCase().includes(searchText) ||
          product.SKU?.toLowerCase().includes(searchText)
        )
      })
      setFilteredProducts(filtered)
    }, 300),
    []
  )

  // Update filtered products when search term or products change
  useEffect(() => {
    debouncedSearch(searchTerm, allProducts)
  }, [searchTerm, allProducts, debouncedSearch])

  // Calculate product summary
  const calculateSummary = (products: IProduct[]): ProductSummary => {
    return products.reduce(
      (acc, product) => {
        acc.totalPriceRSD += product.price * product.quantity
        acc.totalPriceEUR += (product.price * product.quantity) / 117
        acc.totalQuantity += product.quantity
        return acc
      },
      { totalPriceRSD: 0, totalPriceEUR: 0, totalQuantity: 0 }
    )
  }

  const summary = calculateSummary(allProducts)

  // Table columns definition
  const getColumns = (): ColumnsType<IProduct> => [
    {
      title: 'Proizvod',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Proizvođač',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      sorter: (a, b) => (a.manufacturer || '').localeCompare(b.manufacturer || ''),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => (a.model || '').localeCompare(b.model || ''),
    },
    {
      title: 'Cena (RSD)',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => (
        <span className="text-lg font-bold text-blue-800">
          {price.toLocaleString('sr-RS')} RSD
        </span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      key: 'SKU',
      render: (sku) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'venera',
                label: (
                  <a
                    href={`https://www.venerabike.rs/pretraga?q=${sku}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Venera Bike
                  </a>
                ),
              },
              {
                key: 'swords',
                label: (
                  <a
                    href={`https://swordsrbija.com/?s=${sku}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Swords Srbija
                  </a>
                ),
              },
              {
                key: 'tehnomotornis',
                label: (
                  <a
                    href={`https://www.tehnomotornis.rs/pretraga?q=${sku}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Tehnomotornis
                  </a>
                ),
              },
            ],
          }}
        >
          <Button 
            type="primary" 
            className="p-0 w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              padding: '4px 8px',
              height: 'auto',
              fontSize: '14px'
            }}
          >
            {sku}
          </Button>
        </Dropdown>
      ),
    },
    {
      title: 'Količina',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => (
        <Button
          type="primary"
          style={{
            backgroundColor: quantity > 0 ? '#52c41a' : '#f5222d',
            borderColor: quantity > 0 ? '#52c41a' : '#f5222d',
          }}
        >
          {quantity}
        </Button>
      ),
      filters: [
        { text: 'Na stanju', value: 1 },
        { text: 'Nema na stanju', value: 0 },
      ],
      onFilter: (value, record) => (record.quantity > 0 ? 1 : 0) === value,
    },
    {
      title: 'Akcije',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <ActionButtons record={record} />
      ),
    },
  ]

  const ActionButtons = ({ record }: { record: IProduct }) => (
    <Space size="middle">
      <Tooltip title="Izmeni">
        <Button
          type="primary"
          ghost
          onClick={() => handleEdit(record, setEditingProduct, formProductList, setIsModalOpen)}
          icon={<EditOutlined />}
          aria-label={`Izmeni proizvod ${record.name}`}
        />
      </Tooltip>
      <Popconfirm
        title="Da li ste sigurni da želite da obrišete ovaj proizvod?"
        onConfirm={() => handleDelete(record.id, filteredProducts, setFilteredProducts)}
        onCancel={() => message.info('Brisanje proizvoda otkazano')}
        okText="Da"
        cancelText="Ne"
        okButtonProps={{ className: 'bg-green-500' }}
        cancelButtonProps={{ className: 'bg-red-500' }}
      >
        <Tooltip title="Obriši">
          <Button danger ghost icon={<DeleteOutlined />} aria-label={`Obriši proizvod ${record.name}`} />
        </Tooltip>
      </Popconfirm>
    </Space>
  )

  return (
    <div className="product-container bg-white min-h-[calc(100vh-6rem)] p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Create Product Form - Left Side */}
        <div className="lg:col-span-1">
          <CreateNewProductForm />
        </div>

        {/* Product List - Right Side */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <Input.Search
              size="large"
              placeholder="Pretraži proizvode..."
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              enterButton
              loading={loading}
              className="max-w-md"
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card title="Ukupna vrednost (RSD)" bordered={false} className="shadow-sm bg-blue-50">
              <div className="text-3xl font-bold text-blue-800">
                {summary.totalPriceRSD.toLocaleString('sr-RS')} RSD
              </div>
            </Card>
            <Card title="Ukupna vrednost (EUR)" bordered={false} className="shadow-sm bg-green-50">
              <div className="text-3xl font-bold text-green-800">
                {Math.round(summary.totalPriceEUR).toLocaleString('sr-RS')} €
              </div>
            </Card>
            <Card title="Ukupna količina" bordered={false} className="shadow-sm bg-purple-50">
              <div className="text-3xl font-bold text-purple-800">
                {summary.totalQuantity.toLocaleString('sr-RS')}
              </div>
            </Card>
          </div>

          {/* Products Table */}
          <Table
            columns={getColumns()}
            dataSource={filteredProducts}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Ukupno ${total} proizvoda`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: true }}
            className="shadow-sm rounded-lg overflow-hidden"
          />

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Nema pronađenih proizvoda</h2>
              <Link to="/ProductCreate" className="text-blue-600 hover:underline">
                Dodajte novi proizvod
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal
        title={`Uređivanje proizvoda: ${editingProduct.name || ''}`}
        open={isModalOpen}
        onOk={() => handleSave(formProductList, editingProduct, filteredProducts, setFilteredProducts, setIsModalOpen)}
        onCancel={() => setIsModalOpen(false)}
        okText="Sačuvaj"
        cancelText="Otkaži"
        okButtonProps={{ className: 'bg-blue-500' }}
        cancelButtonProps={{ className: 'bg-red-500' }}
        width={700}
      >
        <Form
          form={formProductList}
          layout="vertical"
          className="mt-6"
          initialValues={editingProduct}
        >
          <Form.Item
            label="Naziv proizvoda"
            name="name"
            rules={[{ required: true, message: 'Unesite naziv proizvoda' }]}
          >
            <Input placeholder="Naziv proizvoda" />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Proizvođač" name="manufacturer">
              <Input placeholder="Proizvođač" />
            </Form.Item>
            <Form.Item label="Model" name="model">
              <Input placeholder="Model" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Cena (RSD)"
              name="price"
              rules={[{ required: true, message: 'Unesite cenu' }]}
            >
              <InputNumber
                min={0}
                step={100}
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item
              label="Količina"
              name="quantity"
              rules={[{ required: true, message: 'Unesite količinu' }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item
            label="SKU"
            name="SKU"
            rules={[{ required: true, message: 'Unesite SKU' }]}
          >
            <Input placeholder="SKU kod" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductsList