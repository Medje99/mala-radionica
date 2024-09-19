import { Button, Form, Input, Select, Typography } from 'antd'
import { IProduct } from '@/model/response/IProductResponse'
import { useEffect } from 'react'
import { onHandleSubmit } from './actions'
import { useGlobalContext } from '@/components/GlobalContextProvider'
import { useGetAllProducts } from '@/components/tables/products-table-components/actions'

export const createNewProductForm = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Unos proizvoda')
  }, [])
  const [createNewProductForm] = Form.useForm<IProduct>()
  const { uniqueManufacturers } = useGetAllProducts()

  return (
    <div className=" flex-row product bg-gradient-to-r from-purple-500 to-pink-500 h-[calc(100vh-6rem)]">
      <Form
        id="create-new-product-form"
        form={createNewProductForm}
        title="Unos proizvoda"
        layout="vertical"
        className=" rounded-lg md:my-24  md:w-[30%] lg:w-[30%] flex flex-col items-center"
      >
        <Typography.Title level={1} className="text-center pb-10">
          Unos proizvoda
        </Typography.Title>

        <Form.Item
          rules={[{ required: true, message: 'Popuni naziv proizvoda!' }]}
          className="w-full md:w-3/4 lg:w-2/3 "
          label="Naziv proizvoda"
          name="name"
          labelCol={{ span: 24 }}
        >
          <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>

        <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 gap-6 md:gap-8">
          <Form.Item className="mb-4 w-full md:w-1/2" label="Proizvođač" name="manufacturer" labelCol={{ span: 24 }}>
            <Select
              onKeyDown={(event: any) => {
                createNewProductForm.setFieldValue('manufacturer', event.target.value)
              }}
              showSearch
              placeholder="Izaberi proizvođača"
              filterOption={(input, option) => {
                const optionText = option?.children ? (option.children as unknown as string).toLowerCase() : ''
                return optionText.includes(input.toLowerCase())
              }}
              notFoundContent={null}
            >
              {uniqueManufacturers.map((manufacturer) => (
                <Select.Option key={manufacturer} value={manufacturer ?? ''}>
                  {manufacturer}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-4 w-full md:w-1/2" label="Model" name="model" labelCol={{ span: 24 }}>
            <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 gap-6 md:gap-8">
          <Form.Item
            rules={[{ required: true, message: 'Unesite cenu!' }]}
            className="mb-4 w-full md:w-1/3"
            label="Cena"
            name="price"
            labelCol={{ span: 24 }}
          >
            <Input
              type="number"
              min={1}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Molimo unesite količinu!' }]}
            className="mb-4 w-full md:w-1/3"
            label="Količina"
            name="quantity"
            labelCol={{ span: 24 }}
          >
            <Input
              type="number"
              min={0}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item className="mb-4 w-full md:w-1/3" label="SKU" name="SKU" labelCol={{ span: 24 }}>
            <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
        </div>

        <div className="flex justify-center gap-8 mt-8">
          <Button
            type="primary"
            className="px-6 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
            onClick={() => onHandleSubmit(createNewProductForm)}
          >
            Potvrdi
          </Button>
          <Button
            type="default"
            className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium"
            onClick={() => createNewProductForm.resetFields()}
          >
            Otkazi
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default createNewProductForm
