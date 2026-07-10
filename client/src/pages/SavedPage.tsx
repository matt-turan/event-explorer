import { useState, useEffect } from 'react'
import { getSavedEvents, deleteSavedEvent } from '../services/api'
import type { SavedEvent } from '../types/event'

export default function SavedPage() {
    const [events, setEvents] = useState<SavedEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async (id: number) => {
        try {
            await deleteSavedEvent(id)
            setEvents(prev => prev.filter(e => e.id !== id))
        } catch {
            alert('Failed to remove event.')
        }
    }

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const data = await getSavedEvents()
                setEvents(data)
            } catch {
                setError('Failed to load saved events.')
            } finally {
                setLoading(false)
            }
        }
        fetchSaved()
    }, [])

    if (loading) return (
        <div className="text-center py-12 text-gray-400">Loading saved events...</div>
    )

    if (error) return (
        <div className="text-center py-12 text-red-500">{error}</div>
    )

    if (events.length === 0) return (
        <div className="text-center py-12 text-gray-400">
            No saved events yet. Search for events and save ones you're interested in.
        </div>
    )

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Saved Events
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                    <div
                        key={event.id}
                        className="
                        flex flex-col
                        bg-white
                        rounded-lg
                        border
                        border-gray-200
                        overflow-hidden"
                    >
                        {event.imageUrl && (
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="flex flex-col grow p-4">
                            <p className="text-xs text-blue-600 font-medium mb-1">
                                {event.category}
                            </p>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {event.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                                {new Date(event.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                {event.venue}, {event.city}
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                                This event was saved on: {new Date(event.savedAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-auto">
                                <a
                                    href={event.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">
                                    View Tickets
                                </a>

                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}