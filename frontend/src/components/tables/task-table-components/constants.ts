import moment from 'moment'

export const contact_firstName = {
  title: 'Ime',
  dataIndex: 'firstName',
  key: 'firstName',
  align: 'center',
}

export const contact_lastName = {
  title: 'Prezime',
  dataIndex: 'lastName',
  key: 'lastName',
  align: 'center',
}
export const contact_phoneNumber = {
  title: 'Telefon',
  dataIndex: 'phoneNumber',
  key: 'phoneNumber',
  align: 'center',
}

export const taskName = {
  title: 'Naziv posla',
  dataIndex: 'job_name',
  key: 'job_name',
  align: 'center',
}

export const taskDescription = {
  title: 'Opis posla',
  dataIndex: 'job_description',
  key: 'job_description',
  align: 'center',
}

export const creation_date = {
  title: 'Kreirano',
  dataIndex: 'creation_date',
  key: 'creation_date',
  align: 'center',

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
