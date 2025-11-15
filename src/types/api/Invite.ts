import { Yard } from "./Yard.ts"

export interface Invite {
    id: number
    user: {
        id: number
        phone: string
        name: string
    }
    yard: Yard
    createdAt: string
}