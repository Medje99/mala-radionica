import { formatDateFromNow, sortByDateDescending } from './utils'

export const firstName = {
  title: 'Musterija',
  dataIndex: 'firstName',
  key: 'firstName',
  align: 'center',
}

export const taskName = {
  title: 'Posao',
  dataIndex: 'job_name',
  key: 'job_name',
  align: 'center',
}
export const endDate = {
  title: 'Završetak',
  dataIndex: 'end_date',
  key: 'end_date',
  sorter: sortByDateDescending,
  defaultSortOrder: 'ascend',
  render: (endDate: string | Date) => formatDateFromNow(endDate),
  align: 'center',
}

export const total_cost = {
  title: 'Total',
  dataIndex: 'total_cost',
  key: 'total_cost',
  align: 'center',
}

export const parts_cost = {
  title: 'Proizvodi',
  dataIndex: 'parts_cost',
  key: 'parts_cost',
  align: 'center',
}

export const laborCost = {
  title: 'Usluga',
  dataIndex: 'labor_cost',
  key: 'labor_cost',
  align: 'center',
}
