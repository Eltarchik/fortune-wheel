interface AddressData {
    auto_numbers: string[]
    yard_id: number
}

export interface UserData {
    id: number,
    phone: string,
    name: string,
    addresses: Record<string, AddressData>
}