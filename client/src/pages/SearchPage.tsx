import { useState } from 'react'
import { searchEvents, saveEvent } from '../services/api'
// import type { Event, EventSearchResponse } from '../types/event'
import type { Event } from '../types/event'
import { useSearchStore } from '../stores/searchStore'

export default function SearchPage() {
    // const [keyword, setKeyword] = useState('')
    // const [city, setCity] = useState('')
    // const [page, setPage] = useState(1)
    // const [results, setResults] = useState<EventSearchResponse | null>(null)
    // const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        keyword, city, page, results, savedIds,
        setKeyword, setCity, setPage, setResults, addSavedId
    } = useSearchStore()

    console.log('useSearchStore ', useSearchStore)
    console.log('keyword ', keyword)
    console.log('city ', city)
    console.log('page ', page)
    console.log('results ', results)
    console.log('savedIds ', savedIds)




    // Calculate which page numbers to show in the window
    // Outside return, after your state declarations
    const windowSize = 6
    const currentWindow = Math.ceil(page / windowSize)
    // console.log('page ', page)
    // console.log('currentWindow ', currentWindow)
    const windowStart = (currentWindow - 1) * windowSize + 1
    // console.log('windowStart ', windowStart)
    const windowEnd = results
    ? Math.min(currentWindow * windowSize, results.totalPages)
    : windowSize
    // console.log('windowEnd ', windowEnd)

    const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!keyword && !city) return

        setLoading(true)
        setError(null)
        setPage(1)

        try {
            const data = await searchEvents(keyword, city, 1)
            console.log('Search results:', data) // Log the search results for debugging
            setResults(data)
        } catch {
            setError('Failed to fetch events. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = async (keyword: string, city: string, newPage: number) => {
        console.log(`Changing to page: ${newPage} --- and current page: ${page}`) // Log the new page number for debugging

        if (newPage < 1 || (results && newPage > results.totalPages) ) return

        setPage(newPage)

        try {
            const data = await searchEvents(keyword, city, newPage)
            console.log('Search results:', data) // Log the search results for debugging
            setResults(data)
        } catch {
            setError('Failed to fetch events. Please try again.')
        }
    }

    const handleSave = async (event: Event) => {
        try {
            await saveEvent(event)
            addSavedId(event.id);
            // setSavedIds(prev => new Set(prev).add(event.id))
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
                <div className="flex flex-col min-h-screen">
                    <p className="text-sm text-gray-500 mb-4">
                        {results.total} events found
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

                    <ul className="w-full flex justify-center items-center mt-auto text-sm">

                        {windowStart > 1  && (
                            <>
                                <li
                                    className="w-8 flex justify-center items-center mx-0.5 p-1 h-8 bg-blue-50 hover:bg-blue-100 text-gray-600 hover:text-gray-900 cursor-pointer text-sm"
                                    onClick={() => handlePageChange(keyword, city, page - 1)}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" className="size-6">
                                        <path
                                            d="M10.333 12.6667L5.66634 8.00004L10.333 3.33337"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </li>
                                <li className="mx-0.5 p-1 h-8 text-gray-400">...</li>
                            </>
                        )}

                        {results.totalPages > 0 && results.total > 10 && (

                            Array.from(
                            {length: windowEnd - windowStart + 1 },
                            (_, i) => {
                                const pageNumber = windowStart + i
                                const isActive = page === pageNumber

                                return (
                                    <li
                                        key={pageNumber}
                                        onClick={() => handlePageChange(keyword, city, pageNumber)}
                                        className={`w-8 flex justify-center items-center mx-0.5 cursor-pointer p-1 h-8 bg-blue-50 hover:bg-blue-100 ${isActive ? 'font-bold text-blue-600 bg-blue-100' : 'text-gray-600'
                                    }`}
                                    >
                                        {pageNumber}
                                    </li>
                                )
                            })

                            // Array.from({ length: results.totalPages < 10 ? results.totalPages : totalPages }, (elem, i) => {
                            //     // console.log(`elem: ${elem} - index: ${i}`) // Log the current element and index for debugging;
                            //     // if (totalPages > 10) {

                            //     // }
                            //     const pageNumber = i + 1;
                            //     // console.log(`pageNumber: ${pageNumber}, current page: ${page}`) // Log the current page number and the active page for debugging
                            //     const isActive = page === pageNumber; // Compares if this loop item is the active page

                            //     return (
                            //         <li
                            //             key={i}
                            //             onClick={() => handlePageChange(keyword, city, pageNumber)}
                            //             className={`
                            //             mx-1 cursor-pointer p-1
                            //             ${isActive ? 'font-bold text-blue-600 h-8 bg-blue-50 hover:bg-blue-100' : 'text-gray-600'}
                            //             `}
                            //         >
                            //             {pageNumber}
                            //         </li>
                            //     )
                            // })
                        )}

                        {windowEnd < results.totalPages && (
                            <>
                                <li className="mx-0.5 p-1 text-gray-400">...</li>
                                <li
                                    className="w-8 flex justify-center items-center mx-0.5 p-1 h-8 bg-blue-50 hover:bg-blue-100 text-gray-600 hover:text-gray-900 cursor-pointer text-sm"
                                    onClick={() => handlePageChange(keyword, city, page + 1)}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" className="size-6">
                                        <path
                                            d="M5.66699 12.6667L10.3337 8.00004L5.66699 3.33337"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
            )}
        </div>
    )
}