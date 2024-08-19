export interface ITaskResponse {
  id: number
  contact_id: number
  job_name: string
  job_description: string
  bill_id: number
  creation_date: Date
  end_date?: Date
}
