export interface ITaskResponse {
  id: number
  contact_id: number
  job_name: string
  job_description: string
  firstName: string
  lastName: string
  creation_date: Date
  end_date: Date
}

export interface ITask {
  end_date?: Date | null
  task_id?: number
  task_name?: string
}
