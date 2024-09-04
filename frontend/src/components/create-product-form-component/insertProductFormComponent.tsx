import { Button, Form, Input, Typography } from 'antd'
import { IProducts } from '@/model/response/IProductResponse'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { useEffect } from 'react'
import { onHandleSubmit } from './actions'

export const InsertProductFormComponent = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Unos proizvoda')
  }, [])
  const [form] = Form.useForm<IProducts>()

  return (
    <Form
      id="product-form"
      form={form}
      title="Unos proizvoda"
      layout="vertical"
      className="bg-white rounded-lg shadow-md p-8 mt-[3%] m-auto h-[80vh] md:w-[40%] flex flex-col justify-center items-center"
    >
      <Typography.Title level={2} className="text-center mb-8 text-gray-800">
        Unos proizvoda
      </Typography.Title>

      <Form.Item className="w-full md:w-3/4 lg:w-2/3 mb-6" label="Naziv proizvoda" name="name" labelCol={{ span: 24 }}>
        <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Form.Item>

      <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 gap-6 md:gap-8">
        <Form.Item className="mb-4 w-full md:w-1/2" label="Proizvodjac" name="manufacturer" labelCol={{ span: 24 }}>
          <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
        <Form.Item className="mb-4 w-full md:w-1/2" label="Model" name="model" labelCol={{ span: 24 }}>
          <Input className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
      </div>

      <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 gap-6 md:gap-8">
        <Form.Item className="mb-4 w-full md:w-1/3" label="Cena" name="price" labelCol={{ span: 24 }}>
          <Input
            type="number"
            min={1}
            className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Item>
        <Form.Item className="mb-4 w-full md:w-1/3" label="Kolicina" name="quantity" labelCol={{ span: 24 }}>
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
          onClick={() => onHandleSubmit(form)}
        >
          Potvrdi
        </Button>
        <Button
          type="default"
          className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium"
          onClick={() => form.resetFields()}
        >
          Otkazi
        </Button>
      </div>
    </Form>
  )
}

export default InsertProductFormComponent
