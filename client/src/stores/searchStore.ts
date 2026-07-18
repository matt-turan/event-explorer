import { create } from 'zustand'
import type { EventSearchResponse } from '../types/event'

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

export const useSearchStore = create<SearchStore>((set) => ({
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
}))

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