import { useState } from 'react'
import {
  PlusOutlined,
  MinusOutlined,
  DeleteRowOutlined,
  InsertRowBelowOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space, Tooltip } from 'antd'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'

const { Option } = Select

const ProductsComponent = () => {
  const [rows, setRows] = useState<{ id: number; inventoryQ: number; name: string }[]>([]) // Start with one row with a default maxQuantity
  const { allProducts } = useGetAllProducts()

  const handleProductChange = (rowIndex: number, productId: number) => {
    const selectedProduct = allProducts.find((product) => product.id === productId)
    const maxQuantity = selectedProduct ? selectedProduct.quantity : 0

    const name = selectedProduct?.name ?? ''

    const updatedRows = rows.map((row, index) => (index === rowIndex ? { ...row, inventoryQ: maxQuantity, name } : row))
    setRows(updatedRows)
  }

  const getFields = () => {
    return rows.map((row, index) => (
      <Row gutter={24} key={index}>
        <Col span={11}>
          <Form.Item
            name={['products_used', row.id, 'product']}
            label={`Proizvod  ${index + 1}`}
            rules={[
              {
                required: true,
                message: 'Izaberi proizvod!',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="proizvod"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionText = option?.children as unknown as string
                return optionText.toLowerCase().includes(input.toLowerCase())
              }}
              onChange={(value) => {
                handleProductChange(index, value)
              }}
            >
              {allProducts.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            name={['products_used', row.id, 'quantity']}
            label={`Kolicina: ${index + 1}`}
            rules={[
              {
                required: true,
                message: 'Molimo unesite kolicinu!',
              },
              {
                validator: (_, value) => {
                  if (value > row.inventoryQ) {
                    return Promise.reject(new Error(`Preostali proizvodi: ${row.inventoryQ}!`))
                  } else if (value < 1) {
                    return Promise.reject(new Error('Izaberi min. 1 proizvod!'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input name="quantity" allowClear placeholder="Kolicina" type="number" min="1" max={row.inventoryQ} />
          </Form.Item>
        </Col>
      </Row>
    ))
  }

  const addRow = () => {
    setRows([...rows, { id: rows.length, inventoryQ: 0, name: '' }]) // Add new row with default maxQuantity
  }

  const removeRow = () => {
    if (rows.length > 0) {
      setRows(rows.slice(0, -1)) // Remove the newest row
    }
  }

  return (
    <>
      {getFields()}
      <Form.Item>
        <Space className=" flex gap-10 flex-row items-center justify-center mt-4">
          <Tooltip title="Dodaj novi proizvod" placement="left">
            <Button type="primary" onClick={addRow} icon={<PlusOutlined />}>
              <ArrowDownOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Ukloni proizvod" placement="right">
            <Button type="dashed" onClick={removeRow} icon={<MinusOutlined />}>
              <ArrowUpOutlined />
            </Button>
          </Tooltip>
        </Space>
      </Form.Item>
    </>
  )
}

export default ProductsComponent
