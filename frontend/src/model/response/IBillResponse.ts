export interface IBillResponse {
  firstName: string | null
  bill_id: number
  id: number // The unique identifier for the bill
  job_id: number // The ID of the job associated with the bill
  end_date: Date // The end date of the job/bill, can be null
  labor_cost: number // The cost of labor associated with the bill
  paid: boolean // A flag indicating whether the bill has been paid
  parts_cost?: number // The total cost of the bill, including labor and products used
  products_used: BillProducts[] // A string listing the products used (this could be an array or JSON if needed)
  job_name: string // The name of the job associated with the bill
}

export interface ProductsUsed {
  id?: number
  quantity: number
  name?: string
}

export interface BillProducts {
  product: number
  quantity: number
  name?: string
}
