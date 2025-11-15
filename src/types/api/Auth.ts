export interface AuthData {
    access: string
    refresh: string
    user: {
        id: number
        phone: string
        full_name: string
        email: string
    }
}