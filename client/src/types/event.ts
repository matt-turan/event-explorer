export interface Event {
    id: string
    name: string
    date: string
    time?: string
    venue?: string
    city?: string
    country?: string
    image?: string
    url?: string
    minPrice?: number
    maxPrice?: number
    category?: string
}

export interface EventSearchResponse {
    events: Event[]
    total: number
    totalPages: number
    page: number
}

export interface SavedEvent {
    id: number
    ticketmasterId: string
    name: string
    startDate: string
    venue?: string
    city?: string
    imageUrl?: string
    url?: string
    category?: string
    savedAt: string
}