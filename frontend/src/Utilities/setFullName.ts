export const concateFullName = (
  firstName: string,
  lastName: string,
  separator = ' '
) => {
  return `${firstName}${separator}${lastName}`
}
