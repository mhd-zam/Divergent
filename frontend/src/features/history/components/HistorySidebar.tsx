import React from 'react';
import { useHistoryStore } from '../store/historyStore';
import { usePromptStore } from '../../prompt/store/promptStore';
import { truncate, formatTimestamp } from '../../../shared/lib/helpers';

interface HistorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    onToggle,
}) => {
    const { entries, searchQuery, setSearchQuery, getFilteredEntries, removeEntry } =
        useHistoryStore();
    const { setCurrentPrompt } = usePromptStore();

    const filteredEntries = getFilteredEntries();

    const handleEntryClick = (entry: typeof entries[0]) => {
        setCurrentPrompt(entry.prompt);
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
          shrink-0 h-full border-r border-border-subtle bg-bg-secondary
          flex flex-col transition-all duration-300 ease-out overflow-hidden
          ${isOpen ? 'w-[280px]' : 'w-0'}
        `}
                aria-label="Prompt history"
            >
                <div className="flex flex-col h-full min-w-[280px]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                        <h2 className="text-sm font-semibold text-text-primary">History</h2>
                        <button
                            onClick={onToggle}
                            className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                            aria-label="Close sidebar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="11 17 6 12 11 7" />
                                <polyline points="18 17 13 12 18 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <svg
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                id="history-search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search history..."
                                className="w-full pl-8 pr-3 py-2 text-sm bg-bg-input border border-border-subtle rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:border-accent focus:outline-none focus:shadow-[0_0_12px_rgba(129,140,248,0.1)]
                  transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Entry list */}
                    <div className="flex-1 overflow-y-auto px-2 pb-2">
                        {entries.length === 0 ? (
                            // Empty state
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mb-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                                        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-text-secondary text-sm font-medium mb-1">No history yet</p>
                                <p className="text-text-tertiary text-xs">
                                    Your generated apps will appear here
                                </p>
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-text-tertiary text-sm">No matching entries</p>
                            </div>
                        ) : (
                            filteredEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => handleEntryClick(entry)}
                                    className="w-full text-left p-3 rounded-lg mb-1
                    hover:bg-bg-elevated transition-all duration-150
                    group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-primary font-medium truncate">
                                                {truncate(entry.title, 40)}
                                            </p>
                                            <p className="text-xs text-text-tertiary mt-1">
                                                {formatTimestamp(entry.timestamp)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeEntry(entry.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-error transition-all p-1 cursor-pointer"
                                            aria-label="Delete entry"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </aside>

            {/* Collapsed toggle button */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-20
            w-6 h-16 bg-bg-secondary border border-border-subtle border-l-0
            rounded-r-lg flex items-center justify-center
            text-text-tertiary hover:text-text-primary hover:bg-bg-elevated
            transition-all duration-200 cursor-pointer"
                    aria-label="Open sidebar"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                    </svg>
                </button>
            )}
        </>
    );
};
