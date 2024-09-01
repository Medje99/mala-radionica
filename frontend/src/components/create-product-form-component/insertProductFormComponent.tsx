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
      form={form}
      name="musterija-form"
      title="Unos proizvoda"
      layout="vertical"
      className="bg-white p-10 rounded-lg w-2/5 mt-7 m-auto"
    >
      <Typography.Title level={2} className="text-center ">
        Unos proizvoda
      </Typography.Title>

      <Form.Item className="mb-4 w-2/3 mt-7 m-auto" label="Naziv proizvoda" name="name">
        <Input className="text-center" />
      </Form.Item>
      <Form.Item className="mb-4 w-2/3 m-auto" label="Proizvodjac" name="manufacturer">
        <Input className="text-center" />
      </Form.Item>
      <Form.Item className="mb-4 w-2/3 m-auto" label="Model" name="model">
        <Input className="text-center" />
      </Form.Item>
      <Form.Item className="mb-4 w-2/3 m-auto" label="Cena" name="price">
        <Input type="number" />
      </Form.Item>
      <Form.Item className="mb-4 w-2/3 m-auto" label="Kolicina" name="quantity">
        <Input type="number" />
      </Form.Item>
      <Form.Item className="mb-4 w-2/3 m-auto" label="SKU" name="SKU">
        <Input className="text-center" />
      </Form.Item>

      <div className="flex justify-center gap-12 mt-5">
        <Button type="primary" onClick={() => onHandleSubmit(form)}>
          Potvrdi
        </Button>
        <Button type="default" onClick={() => form.resetFields()}>
          Otkazi
        </Button>
      </div>
    </Form>
  )
}

export default InsertProductFormComponent
