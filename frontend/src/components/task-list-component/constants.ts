export const taskName = {
  title: 'Task Name',
  dataIndex: 'job_name',
  key: 'job_name',
  editable: true,
}

export const taskDescription = {
  title: 'Description',
  dataIndex: 'job_description',
  key: 'job_description',
  editable: true,
}

export const laborCost = {
  title: 'Labor Cost',
  dataIndex: 'labor_cost',
  key: 'labor_cost',
  editable: true,
  render: (cost: number) => `$${cost}`,
}

export const paid = {
  title: 'Paid',
  dataIndex: 'paid',
  key: 'paid',
  editable: true,
  render: (paid: boolean) => (paid ? 'Yes' : 'No'),
}

export const finishedDate = {
  title: 'Finished Date',
  dataIndex: 'finished_date',
  key: 'finished_date',
  editable: true,
  render: (date: string) => new Date(date).toLocaleDateString(),
}
