import moment from 'moment'

export const customer_firstName = {
  title: 'Ime',
  dataIndex: 'firstName',
  key: 'firstName',
  width: 50,
}

export const customer_lastName = {
  title: 'Prezime',
  dataIndex: 'lastName',
  key: 'lastName',
  width: 50,
}

export const taskName = {
  title: 'Naziv posla',
  dataIndex: 'job_name',
  key: 'job_name',
  width: 50,
}

export const taskDescription = {
  title: 'Opis posla',
  dataIndex: 'job_description',
  key: 'job_description',
  width: 1,
}

export const creation_date = {
  title: 'Kreirano',
  dataIndex: 'creation_date',
  key: 'creation_date',
  width: 35,

  sorter: (a: { creation_date: string | number | Date }, b: { creation_date: string | number | Date }) => {
    if (a.creation_date && b.creation_date) {
      return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
    } else {
      return 0
    }
  },
  defaultSortOrder: 'ascend', // Set default sort order to newer first
  render: (date: string) => moment(date).fromNow(),
}
