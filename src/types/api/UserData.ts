export interface UserData {
    id: number,
    phone: string,
    name: string,
    addresses: Record<string, string[]>
}