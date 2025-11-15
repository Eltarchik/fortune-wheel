export interface Yard {
    id: number
    address: string
}

export interface HistoryEntry {
    auto_number: string
    created_at: string // time
    event_type: "entry" | "exit"
    yard: Yard
}