import moment from 'moment'
import { formatDateFromNow, sortByDateDescending, sortByEndDateDescending } from './utils'

export const nazivMusterije = {
  title: 'Musterija',
  dataIndex: 'firstName',
  key: 'firstName',
}
export const nazivPosla = {
  title: 'Naslov posla',
  dataIndex: 'job_name',
  key: 'job_name',
}
export const datumZavrsetka = {
  title: 'Datum zavrsetka',
  dataIndex: 'end_date',
  key: 'end_date',
  sorter: sortByDateDescending,
  defaultSortOrder: 'ascend',
  render: (endDate: string | Date) => formatDateFromNow(endDate),
}

export const CenaUsluge = {
  title: 'Cena usluge',
  dataIndex: 'labor_cost',
  key: 'labor_cost',
}
