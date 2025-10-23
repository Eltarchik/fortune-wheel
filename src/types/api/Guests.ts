export interface Guest {
    id: number
    guest_auto_number: string
    yard_address: string
    yard_id: string
    entry_timeout: string | null
    enter_time: string | null
    invite_by_name: string
    created_at: string
}

export interface GuestsData {
    count: number
    current_time: string
    active_guests: Guest[]
}