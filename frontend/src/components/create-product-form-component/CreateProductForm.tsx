import { Button, Form, Input } from 'antd'
import { IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService.ts'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { useEffect } from 'react'

const ProductCreate = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Unos proizvoda')
  }, [])
  const [form] = Form.useForm<IProducts>()

  const onHandleSubmit = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault()
    form
      .validateFields()
      .then((values) => {
        const formatedData = {
          ...values,
        }
        ProductsService.createProductEntry(formatedData).then((createdProduct) => {
          console.log('Product created:', createdProduct)
          // Additional success handling, e.g., reset form, show success message
        })
      })

      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo)
        // Provide user feedback on validation failure
      })
  }
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
          <Input />
        </Form.Item>
        <Form.Item className="mb-4 w-1/2" label="Kolicina" name="quantity">
          <Input />
        </Form.Item>
        <Button type="primary" onClick={(e) => onHandleSubmit(e)}>
          Submit
        </Button>
        <Button type="default" onClick={(e) => e.preventDefault()}>
          Cancel
        </Button>
      </Form>
    </div>
  )
}

export default ProductCreate
