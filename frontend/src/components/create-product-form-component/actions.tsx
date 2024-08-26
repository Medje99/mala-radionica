import { IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { FormInstance } from 'antd/es/form/hooks/useForm'

const onHandleSubmit = (form: FormInstance<IProducts>) => {
  form
    .validateFields()
    .then((values: any) => {
      const formatedData = {
        ...values,
      }
      ProductsService.createProductEntry(formatedData).then((createdProduct) => {
        console.log('Product created:', createdProduct)
        // Additional success handling, e.g., reset form, show success message
      })
    })

    .catch((errorInfo: any) => {
      console.error('Validation failed:', errorInfo)
      // Provide user feedback on validation failure
    })
}
export { onHandleSubmit }
