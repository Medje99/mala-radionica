import { IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { message } from 'antd'
import { FormInstance } from 'antd/es/form/hooks/useForm'

const onHandleSubmit = (form: FormInstance<IProducts>) => {
  form
    .validateFields()
    .then((values: any) => {
      const formatedData = {
        ...values,
      }
      ProductsService.createProductEntry(formatedData)
        .then((createdProduct) => {
          console.log('Product created:', createdProduct)
          message.success('Proizvod uspesno kreiran!')
          // Additional success handling, e.g., reset form, show success message
        })
        .catch((error) => {
          console.error('Error creating product= :', error.response.data.error)
          if (error.sqlMessage && error.response.data.includes('Duplicate entry')) {
            message.error('SKU je zauzet.' + error.response.data.error)
          } else {
            message.error('implement this is false ' + error.data)
          }

          // Additional error handling, e.g., show error message
        })
    })

    .catch((errorInfo: any) => {
      console.error('Validation failed:', errorInfo)
      // Provide user feedback on validation failure
    })
}
export { onHandleSubmit }
