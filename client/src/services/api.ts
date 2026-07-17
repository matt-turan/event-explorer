import axios from 'axios'
import type { Event, EventSearchResponse, SavedEvent } from '../types/event'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const searchEvents = async (
    keyword: string,
    city: string,
    page: number,
): Promise<EventSearchResponse> => {
    const response = await axios.get(`${BASE_URL}/api/events/search`, {
        params: { keyword, city, page }
    })
    return response.data
}

export const saveEvent = async (event: Event): Promise<SavedEvent> => {
    const response = await axios.post(`${BASE_URL}/api/events/save`, {
        ticketmasterId: event.id,
        name: event.name,
        startDate: event.date,
        venue: event.venue,
        city: event.city,
        imageUrl: event.image,
        url: event.url,
        category: event.category,
    })
    return response.data
}

export const getSavedEvents = async (): Promise<SavedEvent[]> => {
    const response = await axios.get(`${BASE_URL}/api/events/saved`)
    return response.data
}

export const deleteSavedEvent = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/api/events/saved/${id}`)
}