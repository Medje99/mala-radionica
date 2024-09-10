import { useEffect, useState } from 'react'
import { PlusOutlined, MinusOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space, Tooltip, Typography } from 'antd'
import { IProduct, IProductUsed } from '@/model/response/IProductResponse'
import { FormInstance } from 'antd' // Import FormInstance from antd
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { useGetAllProducts } from './tables/products-table-components/actions'

const { Option } = Select

type SelectProductsComponentProps = {
  form: FormInstance // Add form as a prop here
  rows: { product: IProductUsed | null; quantity: number }[]
  addRow: () => void
  removeRow: () => void
  setRows: React.Dispatch<React.SetStateAction<{ product: IProductUsed | null; quantity: number }[]>>
}

//SelectProductsComponent logic ready for SeparationOfConsern CleanUP
const SelectProductsComponent: React.FC<SelectProductsComponentProps> = ({ rows, addRow, removeRow, setRows }) => {
  const { allProducts } = useGetAllProducts()
  const [totalPrice, setTotalPrice] = useState(0)
  const selectProductForm = useFormInstance()

  //productNameHelper
  const productNameHelper = (item: IProduct) => {
    return `${item?.manufacturer ?? ''}, ${item?.name ?? ''} #  ${item?.SKU ?? ''}`
  }
  //handleProductChange
  const handleProductChange = (rowIndex: number, productId: number) => {
    const selectedProduct = allProducts.find((product) => product.id === productId)

    setRows((prevRows) => {
      const updatedRows = prevRows.map((row, index) =>
        index === rowIndex
          ? { ...row, product: selectedProduct || null, quantity: selectedProduct ? row.quantity : 0 }
          : row,
      )

      selectProductForm.setFieldsValue({
        // Ensure form is updated with the new row values
        products_used: updatedRows,
      })

      return updatedRows
    })
  }
  //renderRows
  const renderRows = () => {
    return rows.map((row, index) => (
      <Row key={index} justify="space-between" align="middle" className="">
        {/* Added margin-bottom for spacing between rows */}
        <Col span={10}>
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
            {/* this line of code makes select field render propperly after it has been selected */}
            <p className="hidden">{row.product?.name}</p>
            {/* this line of code makes select field render propperly after it has been selected */}

            <Select
              dropdownStyle={{ minWidth: 300, maxHeight: 300, overflowY: 'auto' }}
              showSearch
              placeholder="Izaberi proizvod"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionText = option?.children as unknown as string
                return optionText.toLowerCase().includes(input.toLowerCase())
              }}
              onChange={(value) => {
                //Problem here somewhere
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
        <Col span={6}>
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
              disabled={!row.product}
              value={row.quantity} // Bind input value to row.quantity
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10) || 0 // Get new quantity
                setRows((prevRows) =>
                  prevRows.map(
                    (r, i) => (i === index ? { ...r, quantity: newQuantity } : r), // Update quantity in state
                  ),
                )
              }}
            />
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item label="Cena" className=" text-left">
            {/* Calculate and display the total price for the row */}
            <Typography className="text-center">
              <Typography className="text-center">
                {row.product?.price
                  ? row.quantity === 1 // Check if quantity is 1
                    ? `${row.product.price.toLocaleString()} RSD` // Show price only once
                    : `${row.product.price.toLocaleString()} (${(
                        row.product.price * row.quantity
                      ).toLocaleString()} RSD)` // Show both prices
                  : ' '}
              </Typography>{' '}
            </Typography>
          </Form.Item>
        </Col>
      </Row>
    ))
  }
  //calculateTotal
  const calculateTotal = () => {
    const total = rows.reduce((acc, row) => {
      if (row.product?.price) {
        return acc + row.product.price * row.quantity
      }
      return acc
    }, 0)
    setTotalPrice(total)
  }

  useEffect(() => {
    calculateTotal()
  }, [rows]) // Recalculate whenever 'rows' changes

  //SelectProudctComponent MAIN RETURN
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
      {/* Display total price */}
      {rows.length > 0 && (
        <Row justify="end" className="mt-4">
          <Col>
            <Typography.Text strong style={{ fontSize: '1.6em', textDecoration: 'underline' }}>
              Delovi: {totalPrice.toLocaleString()} RSD
            </Typography.Text>
          </Col>
        </Row>
      )}
    </>
  )
}

export default SelectProductsComponent
