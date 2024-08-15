export interface IBill {
  id: number
  contactId: number
  jobId: number
  finishedDate: Date
  laborCost: number
  paid: boolean
  productsUsed: ProductsUsed[]
}

export interface ProductsUsed {
  id?: number
  quantity: number
  name?: string
}
