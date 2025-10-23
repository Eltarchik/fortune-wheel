interface Yard {
    id: number
    address: string
}

interface HistoryEntry {
    auto: Car
    created_at: string // time
    event_type: "entry" | "exit"
    yard: Yard
}