import moment from 'moment'

export const formatDateFromNow = (dateString: string | Date | undefined): string => {
  if (dateString) {
    return moment(dateString).fromNow()
  } else {
    return 'Nije definisano!'
  }
}

export const sortByDateDescending = (a: { end_date: string | Date }, b: { end_date: string | Date }): number => {
  if (a.end_date && b.end_date) {
    return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  } else {
    return 0
  }
}
