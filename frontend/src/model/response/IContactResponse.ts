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

export interface VLI {
  value: string
  label: string
  id: number
}

export interface wholeContact {}
