export const separateFullName = (fullName: string) => {
  // Split the full name by spaces
  const nameParts = fullName.trim().split(' ')

  // Handle edge cases where full name is less than two words

  if (nameParts.length < 2) {
    return {
      firstName: fullName,
      lastName: '',
    }
  }

  // Separate the first name and last name
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  return {
    firstName,
    lastName,
  }
}
