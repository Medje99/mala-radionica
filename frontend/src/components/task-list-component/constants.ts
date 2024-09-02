import moment from 'moment'

export const customer_firstName = {
  title: 'Ime',
  dataIndex: 'firstName',
  key: 'firstName',
  editable: true,
  width: 150,
}

export const customer_lastName = {
  title: 'Prezime',
  dataIndex: 'lastName',
  key: 'lastName',
  editable: true,
  width: 150,
}

export const taskName = {
  title: 'Naziv posla',
  dataIndex: 'job_name',
  key: 'job_name',
  editable: true,
  max_width: 150,
}

export const taskDescription = {
  title: 'Opis posla',
  dataIndex: 'job_description',
  key: 'job_description',
  editable: true,
  max_width: 350,
}

export const creation_date = {
  title: 'Kreirano',
  dataIndex: 'creation_date',
  key: 'creation_date',
  editable: true,

  width: 120,
  sorter: (a: { creation_date: string | number | Date }, b: { creation_date: string | number | Date }) => {
    if (a.creation_date && b.creation_date) {
      return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
    } else {
      return 0 // Handle cases where creation_date is null or undefined
    }
  },
  defaultSortOrder: 'ascend', // Set default sort order to newer first
  render: (date: string) => moment(date).fromNow(),
}
