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

export const paid = {
  title: 'Placeno',
  dataIndex: 'paid',
  key: 'paid',
  editable: true,
  render: (paid: boolean) => (paid ? 'Yes' : 'No'),
}

export const creation_date = {
  title: 'Kreirano',
  dataIndex: 'creation_date',
  key: 'creation_date',
  editable: true,
  render: (date: string) => moment(date).fromNow(),
}

export const customer_firstName = {
  title: 'Ime',
  dataIndex: 'firstName',
  key: 'firstName',
  editable: true,
}

export const customer_lastName = {
  title: 'Prezime',
  dataIndex: 'lastName',
  key: 'lastName',
  editable: true,
}
