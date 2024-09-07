export interface IProduct {
  id: number
  name: string
  manufacturer: string
  model: string
  price: number
  quantity: number
  SKU: string
  product: IProductResponse
}

export interface IProductResponse {
  id: number
  subractQ: number
  nameModel: string
  product: IProduct
}

export interface IProductUsed {
  product_id: number
  name?: string
  manufacturer?: string
  quantity: number
  price: number
}
