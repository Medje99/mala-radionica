export interface IContactsResponse {
  address: string
  city: string
  firstName: string
  id: number
  lastName: string
  other: string | null
  phoneNumber: string
  fullName: string
}

export interface IContact {
  id: number | undefined
  fullName: string
}
