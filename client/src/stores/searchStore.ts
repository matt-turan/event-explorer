import { create } from 'zustand'
import type { EventSearchResponse } from '../types/event'
import { persist } from 'zustand/middleware'

interface SearchStore {
    keyword: string
    city: string
    page: number
    results: EventSearchResponse | null
    savedIds: Set<string>

    setKeyword: (keyword: string) => void
    setCity: (city: string) => void
    setPage: (page: number) => void
    setResults: (results: EventSearchResponse | null) => void
    addSavedId: (id: string) => void
}

type PersistedState = {
    keyword: string
    city: string
    page: number
    results: EventSearchResponse | null
    savedIds: string[]
}

export const useSearchStore = create<SearchStore>()(
    persist(
        (set) => ({
            keyword: '',
            city: '',
            page: 1,
            results: null,
            savedIds: new Set(),

            setKeyword: (keyword) => set({ keyword }),
            setCity: (city) => set({ city }),
            setPage: (page) => set({ page }),
            setResults: (results) => set({ results }),

            addSavedId: (id) => set((state) => ({
                savedIds: new Set(state.savedIds).add(id)
            })),
        }),
        {
            name: 'search-store',

            partialize: (state) => ({
                keyword: state.keyword,
                city: state.city,
                page: state.page,
                results: state.results,
                savedIds: Array.from(state.savedIds),

            }),

            // merge: (persisted, current) => ({
            //     ...current,
            //     ...(persisted as Partial<SearchStore>),
            //     savedIds: new Set((persisted as Any).savedIds as string[]),
            // }),

            merge: (persisted, current) => {
                const p = persisted as PersistedState
                return {
                    ...current,
                    keyword: p.keyword,
                    city: p.city,
                    page: p.page,
                    results: p.results,
                    savedIds: new Set(p.savedIds),
                }
            },    
        }
    )
)



// export const useSearchStore = create<SearchStore>((set) => ({
//     keyword: '',
//     city: '',
//     page: 1,
//     results: null,
//     savedIds: new Set(),
//     setKeyword: (keyword) => set({ keyword }),
//     setCity: (city) => set({ city }),
//     setPage: (page) => set({ page }),
//     setResults: (results) => set({ results }),
//     addSavedId: (id) => set((state) => ({
//         savedIds: new Set(state.savedIds).add(id)
//     })),
// }))

console.log('city --> ', useSearchStore)
    // Study A
// interface SearchStore {
//     savedIds: Set<string>
//     addSavedId: (id: string) => void
// }

// export const useSearchStore = create<SearchStore>((set) => ({
//     savedIds: new Set(),
//     addSavedId: (id) => set((state) => ({
//         savedIds: new Set(state.savedIds).add(id)
//     })),
// }))