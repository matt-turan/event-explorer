import axios from 'axios'
import type { Event, EventSearchResponse, SavedEvent } from '../types/event'

export const searchEvents = async (
    keyword: string,
    city: string,
    page: number = 1
): Promise<EventSearchResponse> => {
    const response = await axios.get('/api/events/search', {
        params: { keyword, city, page }
    })
    return response.data
}

export const saveEvent = async (event: Event): Promise<SavedEvent> => {
    const response = await axios.post('/api/events/save', {
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
    const response = await axios.get('/api/events/saved')
    return response.data
}

export const deleteSavedEvent = async (id: number): Promise<void> => {
    await axios.delete(`/api/events/saved/${id}`)
}