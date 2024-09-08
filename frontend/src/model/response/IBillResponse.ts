import { Key } from 'react'

export interface IBillResponse {
  id: any
  name: string
  manufacturer: string
  price: number
  bill_id: number
  contact_id: number
  job_id: number
  end_date: Date
  labor_cost: number
  total_cost: number
  paid: boolean
  products_used: BillProducts[]
  parts_cost: number
  firstName: string
  lastName: string
  job_name: string
  job_description: string
  creation_date: Date
}

export interface BillProducts {
  product_id: Key | null | undefined
  manufacturer: string
  price: number
  name: string
  total_price: number
  product: IBillResponse
  quantity: number
}
