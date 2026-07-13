import { useState } from 'react'
import { searchEvents, saveEvent } from '../services/api'
import type { Event, EventSearchResponse } from '../types/event'

export default function SearchPage() {
    const [keyword, setKeyword] = useState('')
    const [city, setCity] = useState('')
    const [results, setResults] = useState<EventSearchResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

    const handleSearch = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!keyword && !city) return
        setLoading(true)
        setError(null)
        try {
            const data = await searchEvents(keyword, city)
            console.log('Search results:', data) // Log the search results for debugging
            setResults(data)
        } catch {
            setError('Failed to fetch events. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (event: Event) => {
        try {
            await saveEvent(event)
            setSavedIds(prev => new Set(prev).add(event.id))
        } catch {
            alert('Failed to save event.')
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Events</h1>

            <form onSubmit={handleSearch} className="flex flex-col md:max-w-[50%] gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Search keyword..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3 flex-row">
                    <input
                        type="text"
                        placeholder="City..."
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="min-w-32 px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            {results && (
                <div>
                    <p className="text-sm text-gray-500 mb-4">
                        {results.total} events found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.events.map(event => (
                            <div
                                key={event.id}
                                className="
                                flex flex-col
                                bg-whiter
                                ounded-lg border
                                border-gray-200
                                overflow-hidden"
                            >
                                {event.image && (
                                    <img
                                        src={event.image}
                                        alt={event.name}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="flex flex-col grow p-4">
                                    <p className="text-xs text-blue-600 font-medium mb-1">
                                        {event.category}
                                    </p>
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {event.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {event.date} {event.time}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {event.venue}, {event.city}
                                    </p>
                                    {event.minPrice !== undefined && event.minPrice !== null ? (
                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                            {event.minPrice === 0 ? "Price: $0 (Free Event)" : `From $${event.minPrice}`}
                                        </p>
                                    ) : null}
                                    <div className="flex gap-2 mt-auto">
                                        <a
                                            href={event.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">
                                            View Tickets
                                        </a>
                                        <button
                                            onClick={() => handleSave(event)}
                                            disabled={savedIds.has(event.id)}
                                            className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {savedIds.has(event.id) ? 'Saved' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}