import { IProduct } from '@/model/response/IProductResponse'
import ProductsService from '@/services/ProductsService'
import { message } from 'antd'
import { FormInstance } from 'antd/es/form/hooks/useForm'
import { AxiosError } from 'axios'

interface ErrorResponse {
  error?: string
}

export const onHandleSubmit = (form: FormInstance<IProduct>) => {
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

export const fetchUniqueManufacturers = async () => {
  try {
    const manufacturers: string[] = await ProductsService.getUniqueManufacturers()
    // Format manufacturer names
    const formattedManufacturers = manufacturers.map((manufacturer) => {
      const trimmedManufacturer = manufacturer.trim()
      return trimmedManufacturer.charAt(0).toUpperCase() + trimmedManufacturer.slice(1)
    })

    return formattedManufacturers // Return the formatted array
  } catch (error) {
    console.error('Error fetching manufacturers:', error)
    return [] // Return an empty array or handle the error as needed
  }
}
