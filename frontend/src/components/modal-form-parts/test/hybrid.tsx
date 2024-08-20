import { useState } from 'react'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space } from 'antd'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'

const { Option } = Select

const Hybrid = () => {
  const [rows, setRows] = useState<
    { id: number; maxQuantity: number; name: string }[]
  >([{ id: 0, maxQuantity: 10, name: '' }]) // Start with one row with a default maxQuantity
  const { allProducts } = useGetAllProducts()

  const handleProductChange = (rowIndex: number, productId: number) => {
    const selectedProduct = allProducts.find(
      (product) => product.id === productId
    )
    const maxQuantity = selectedProduct ? selectedProduct.quantity : 10

    const name = selectedProduct?.name ?? ''

    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, maxQuantity, name } : row
    )
    setRows(updatedRows)
  }

  console.log(rows)

  const getFields = () => {
    return rows.map((row, index) => (
      <Row gutter={24} key={index}>
        <Col span={11}>
          <Form.Item
            name={['products_used', row.id, 'product']}
            label={`Product ${index + 1}`}
            rules={[
              {
                required: true,
                message: 'Please select a product!',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a product"
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionText = option?.children as unknown as string
                return optionText.toLowerCase().includes(input.toLowerCase())
              }}
              style={{ width: 'calc(100% - 32px)' }}
              allowClear
              onChange={(value) => {
                console.log(value)
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
            label={`Quantity ${index + 1}`}
            rules={[
              {
                required: true,
                message: 'Please enter the quantity!',
              },
              {
                validator: (_, value) => {
                  if (value > row.maxQuantity) {
                    return Promise.reject(
                      new Error(
                        `Quantity cannot be more than ${row.maxQuantity}!`
                      )
                    )
                  } else if (value < 1) {
                    return Promise.reject(
                      new Error('Quantity must be at least 1!')
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              placeholder="Enter quantity"
              type="number"
              style={{ width: 'calc(100% - 32px)' }}
              max={row.maxQuantity}
            />
          </Form.Item>
        </Col>
      </Row>
    ))
  }

  const addRow = () => {
    setRows([...rows, { id: rows.length, maxQuantity: 0, name: '' }]) // Add new row with default maxQuantity
  }

  const removeRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1)) // Remove the newest row
    }
  }

  return (
    <>
      {getFields()}
      <Form.Item>
        <Space>
          <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
            Add Row
          </Button>
          <Button type="dashed" onClick={removeRow} icon={<MinusOutlined />}>
            Remove Last Row
          </Button>
        </Space>
      </Form.Item>
    </>
  )
}

export default Hybrid
