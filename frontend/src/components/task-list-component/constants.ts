import moment from 'moment'
export const taskName = {
  title: 'Naziv posla',
  dataIndex: 'job_name',
  key: 'job_name',
  editable: true,
}

export const taskDescription = {
  title: 'Opis posla',
  dataIndex: 'job_description',
  key: 'job_description',
  editable: true,
}

export const laborCost = {
  title: 'Cena izvrsene usluge',
  dataIndex: 'labor_cost',
  key: 'labor_cost',
  editable: true,
  render: (cost: number) => (cost ? `${cost} RSD` : ''),
}

export const paid = {
  title: 'Placeno',
  dataIndex: 'paid',
  key: 'paid',
  editable: true,
  render: (paid: boolean) => (paid ? 'Yes' : 'No'),
}

export const end_date = {
  title: 'Zavrsen datuma',
  dataIndex: 'end_date',
  key: 'end_date',
  editable: true,
  render: (date: string) => moment(date).format('DD/MM/YYYY'),
}
