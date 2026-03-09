import React, { useState } from 'react';
import { ShowcaseCard } from './ShowcaseCard';

import { MOCK_SHOWCASE_ITEMS } from './mockData';

const CATEGORIES = ['All', 'Landing Pages', 'Advanced Apps', 'Business Tools', 'Personal Tools', 'Mobile Apps'];

export const ShowcaseGrid: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredItems = activeCategory === 'All'
        ? MOCK_SHOWCASE_ITEMS
        : MOCK_SHOWCASE_ITEMS.filter(item => item.category === activeCategory);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 mt-24 mb-16 animate-fade-in-up">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-secondary" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Showcase</h2>
                </div>
                <p className="text-text-tertiary text-base">Explore what the community is building with Divergent.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center flex-wrap gap-3 mb-10">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                            ${activeCategory === category
                                ? 'bg-white text-black border-white hover:bg-white/90 shadow-md'
                                : 'glass-pill text-text-secondary hover:text-white border-white/10'
                            }
                        `}
                    >
                        {/* Adding generic icons next to the specific tabs can make it look closer to the UI, 
                            but text-only for 'All' is fine, or simple icons */}
                        <div className="flex items-center gap-2">
                            {category === 'All' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
                            {category === 'Landing Pages' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>}
                            {category === 'Advanced Apps' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                            {category === 'Business Tools' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>}
                            {category === 'Personal Tools' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>}
                            {category === 'Mobile Apps' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>}
                            {category}
                        </div>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12">
                {filteredItems.map(item => (
                    <ShowcaseCard key={item.id} item={item} />
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="py-12 text-center text-text-tertiary">
                    No items found for this category yet.
                </div>
            )}
        </div>
    );
};
