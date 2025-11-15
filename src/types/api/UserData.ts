export interface AddressData {
    address: string
    yard_id: number
}

export interface UserData {
    id: number,
    phone: string,
    name: string,
    addresses: AddressData[]
}