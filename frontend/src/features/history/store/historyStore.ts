import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry } from '../../../shared/types';
import { generateId, extractTitle } from '../../../shared/lib/helpers';

interface HistoryState {
    entries: HistoryEntry[];
    searchQuery: string;

    addEntry: (prompt: string, generatedCode: string) => void;
    removeEntry: (id: string) => void;
    clearHistory: () => void;
    setSearchQuery: (query: string) => void;
    getFilteredEntries: () => HistoryEntry[];
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            entries: [],
            searchQuery: '',

            addEntry: (prompt, generatedCode) => {
                const entry: HistoryEntry = {
                    id: generateId('hist'),
                    prompt,
                    generatedCode,
                    timestamp: Date.now(),
                    title: extractTitle(prompt),
                };
                set((state) => ({
                    entries: [entry, ...state.entries].slice(0, 100), // Keep max 100 entries
                }));
            },

            removeEntry: (id) =>
                set((state) => ({
                    entries: state.entries.filter((e) => e.id !== id),
                })),

            clearHistory: () => set({ entries: [] }),

            setSearchQuery: (query) => set({ searchQuery: query }),

            getFilteredEntries: () => {
                const { entries, searchQuery } = get();
                if (!searchQuery.trim()) return entries;
                const q = searchQuery.toLowerCase();
                return entries.filter(
                    (e) =>
                        e.title.toLowerCase().includes(q) ||
                        e.prompt.toLowerCase().includes(q)
                );
            },
        }),
        {
            name: 'divergent-history',
        }
    )
);
