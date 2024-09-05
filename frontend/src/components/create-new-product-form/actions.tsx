import { IProducts } from '@/model/response/IProductResponse'
import ProductsService from '@/service/ProductsService'
import { message } from 'antd'

import { FormInstance } from 'antd/es/form/hooks/useForm'
import { AxiosError } from 'axios'

interface ErrorResponse {
  error?: string // Or whatever property your backend uses for error messages
  // ... other properties of your error response ...
}

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
          form.resetFields()
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error('Error creating product:', error)

          if (error.response && error.response.data && error.response.data.error) {
            if (error.response.data.error.includes('Duplicate entry')) {
              message.error('SKU je zauzet.')
              return
            }
          }

          message.error('Problem sa dodavanjem proizvoda,kontaktirajte administratora.')
        })
    })
    .catch((errorInfo: any) => {
      console.error('Validation failed:', errorInfo)
    })
}

export { onHandleSubmit }
