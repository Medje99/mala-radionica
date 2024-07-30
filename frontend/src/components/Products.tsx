import React, { useState, useEffect } from 'react'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProducts } from '@/model/response/IProductResponse'
import { Table, Typography, Input } from 'antd'

//Products without Edit functionality

const Products: React.FC = () => {
  const { customers: allProducts } = useGetAllProducts() // Use the hook
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([])

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const searchText = searchTerm.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchText) ||
        product.manufecturer.toLowerCase().includes(searchText) ||
        product.model.toLowerCase().includes(searchText)
      )
    })
    setFilteredProducts(filtered)
  }, [searchTerm, allProducts])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufecturer',
      key: 'manufecturer',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantitiy',
    },
  ]

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
    </div>
  )
}

export default Products
