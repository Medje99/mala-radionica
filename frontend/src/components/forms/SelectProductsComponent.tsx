import { useState } from 'react'
import { PlusOutlined, MinusOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space, Tooltip, Typography } from 'antd'
import useGetAllProducts from '@/CustomHooks/useGetAllProducts'
import { IProduct } from '@/model/response/IProductResponse'

const { Option } = Select

const SelectProductsComponent = () => {
  const [rows, setRows] = useState<{ product: IProduct | null; quantity: number }[]>([])
  const { allProducts } = useGetAllProducts()
  const productNameHelper = (item: IProduct) => {
    return `${item?.manufacturer ?? ''}, ${item?.name ?? ''} #  ${item?.SKU ?? ''}`
  }
  const handleProductChange = (rowIndex: number, productId: number) => {
    const selectedProduct = allProducts.find((product) => product.id === productId)

    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? { ...row, product: selectedProduct || null, quantity: selectedProduct ? row.quantity : 0 } // Reset quantity if no product is selected
          : row,
      ),
    )
  }

  const renderRows = () => {
    return rows.map((row, index) => (
      <Row key={index} justify="space-between" align="middle" className="">
        {/* Added margin-bottom for spacing between rows */}
        <Col span={16} className="pl-7">
          <Form.Item
            name={['products_used', index, 'product']}
            label="Proizvod" // Label added back
            rules={[
              {
                required: true,
                message: 'Izaberi proizvod!',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Izaberi proizvod"
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
                <Option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                  {productNameHelper(item)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            name={['products_used', index, 'quantity']}
            label={row.product?.quantity ? 'Max: ' + row.product.quantity : 'Kolicina:'}
            rules={[
              {
                required: true,
                message: 'Molimo unesite kolicinu!',
              },
              {
                validator: (_, value) => {
                  if (row.product && value > row.product.quantity) {
                    return Promise.reject(new Error(`Preostali proizvodi: ${row.product.quantity}!`))
                  } else if (value < 1) {
                    return Promise.reject(new Error('Izaberi min. 1 proizvod!'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              name="quantity"
              placeholder={!row.product ? ' ' : '0'}
              type="number"
              min="1"
              max={row.product?.quantity || 0}
              disabled={!row.product} // Disable if no product is selected
            />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label="Cena" className="pr-7">
            {/* Label added back */}
            <Typography className="text-right">{row.product?.price ? row.product.price.toFixed(0) : '0'}</Typography>
          </Form.Item>
        </Col>
      </Row>
    ))
  }

  const addRow = () => {
    setRows([...rows, { product: null, quantity: 0 }])
  }

  const removeRow = () => {
    if (rows.length > 0) {
      setRows(rows.slice(0, -1)) // Bug ! remembers last field value even if row is removed tryied a lot idk what is wrong
    }
  }

  return (
    <>
      {/* Add/Slice Row + RenderRows  */}
      <Typography className="font-bold text-xl mb-4 text-center"> Upotrebljeni delovi: </Typography>
      {renderRows()}

      {/* Add/Slice Row + RenderRows  */}

      <Form.Item className="flex flex-col items-center">
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
    </>
  )
}

export default SelectProductsComponent
