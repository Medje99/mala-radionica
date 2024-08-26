import { Button, Form, Input } from 'antd'
import { IProducts } from '@/model/response/IProductResponse'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { useEffect } from 'react'
import { onHandleSubmit } from './actions'

const InsertProductFormComponent = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Unos proizvoda')
  }, [])
  const [form] = Form.useForm<IProducts>()

  return (
    <div>
      <Form form={form} name="musterija-form" layout="vertical" className="bg-white p-5 rounded-lg">
        <Form.Item className="mb-4 w-1/2" label="Naziv proizvoda" name="name">
          <Input />
        </Form.Item>
        <Form.Item className="mb-4 w-1/2" label="Proizvodjac" name="manufacturer">
          <Input />
        </Form.Item>
        <Form.Item className="mb-4 w-1/2" label="Model" name="model">
          <Input />
        </Form.Item>
        <Form.Item className="mb-4 w-1/2" label="Cena" name="price">
          <Input type="number" />
        </Form.Item>
        <Form.Item className="mb-4 w-1/2" label="Kolicina" name="quantity">
          <Input type="number" />
        </Form.Item>
        <Button type="primary" onClick={() => onHandleSubmit(form)}>
          Potvrdi
        </Button>
        <Button type="default" onClick={() => form.resetFields()}>
          Otkazi
        </Button>
      </Form>
    </div>
  )
}

export default InsertProductFormComponent
