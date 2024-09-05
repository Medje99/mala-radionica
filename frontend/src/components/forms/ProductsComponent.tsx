import { useState } from 'react'
import { PlusOutlined, MinusOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space, Tooltip, Typography } from 'antd'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'

const { Option } = Select

const ProductsComponent = () => {
  const [form] = Form.useForm()
  const [rows, setRows] = useState<{ id: number; inventoryQ: number; name: string }[]>([]) // Start with one row with a default maxQuantity
  const { allProducts } = useGetAllProducts()

  const handleProductChange = (rowIndex: number, productId: number) => {
    const selectedProduct = allProducts.find((product) => product.id === productId)
    const maxQuantity = selectedProduct ? selectedProduct.quantity : 0

    const nameModel = selectedProduct?.name + ' ' + selectedProduct?.model ?? ''

    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, inventoryQ: maxQuantity, nameModel } : row,
    )
    setRows(updatedRows)
  }

  const getFields = () => {
    return rows.map((row, index) => (
      <Row gutter={24} key={index} className="justify-center">
        <Col span={7}>
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
              dropdownStyle={{ width: '20em' }}
              showSearch
              placeholder="Proizvodi"
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
                <Option className="wide-option" key={item.id} value={item.id}>
                  {item?.name ?? ' ' + item?.manufacturer ?? ''}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
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

        <Col span={5}>
          <Form.Item label="Cena proizvoda">
            <Typography> {row.inventoryQ ? row.inventoryQ : 0} </Typography>
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
      <Form.Item name="products_used" className="flex flex-col items-center" label="Upotrebljeni delovi:">
        <Space className=" product-select-wrapper mt-4 flex flex-row gap-8 mb-4 ">
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
      {getFields()}
    </>
  )
}

export default ProductsComponent
