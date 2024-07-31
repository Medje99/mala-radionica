import React, { useState, useEffect } from 'react'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProducts } from '@/model/response/IProductResponse'
import { Table, Typography, Input, Button, Empty, Flex } from 'antd'

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
    },
    {
      title: 'Proizvodjac',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Cena',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Kolicina',
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

      {filteredProducts.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{ pageSize: 7 }} // Adjust page size as needed
          rowKey="id" // Use 'id' as the row key
        />
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 120,
          }}
        >
          <Button type="primary">Create Now</Button>
        </Empty>
      )}
    </div>
  )
}

export default Products
