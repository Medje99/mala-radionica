export interface IProduct {
  id: number
  name: string
  manufacturer: string
  model: string
  price: number
  quantity: number
  SKU: string
}

export interface IProductResponse {
  id: number
  subractQ: number
  nameModel: string
}
