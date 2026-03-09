import React, { useCallback, useRef, useEffect } from 'react';
import { PromptInput } from './PromptInput';
import { useStream } from '../../../shared/hooks/useStream';
import { usePromptStore } from '../store/promptStore';
import { useHistoryStore } from '../../history/store/historyStore';
import { ShowcaseGrid } from './showcase/ShowcaseGrid';

export const PromptWorkspace: React.FC = () => {
    const {
        currentPrompt,
        setCurrentPrompt,
    } = usePromptStore();

    // Read from the store for active mode detection (survives remounts)
    const storeGeneratedCode = usePromptStore((s) => s.generatedCode);
    const storeIsStreaming = usePromptStore((s) => s.isStreaming);
    const storeThinking = usePromptStore((s) => s.thinkingText);

    const { chunks, thinking, isStreaming, error, startStream } = useStream();
    const addEntry = useHistoryStore((s) => s.addEntry);
    const entries = useHistoryStore((s) => s.entries);
    const thinkingEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = useCallback(async () => {
        if (!currentPrompt.trim() || isStreaming || storeIsStreaming) return;
        await startStream(currentPrompt);
    }, [currentPrompt, isStreaming, storeIsStreaming, startStream]);

    // Save to history when streaming completes
    React.useEffect(() => {
        if (!isStreaming && chunks && currentPrompt.trim()) {
            addEntry(currentPrompt, chunks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    // Auto-scroll thinking text
    const displayThinking = thinking || storeThinking;
    useEffect(() => {
        if (displayThinking && thinkingEndRef.current) {
            thinkingEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [displayThinking]);

    // Use store state for active detection (local state resets on remount, store doesn't)
    const isActive = !!(storeGeneratedCode || storeIsStreaming || chunks || isStreaming);
    const activeStreaming = isStreaming || storeIsStreaming;

    // ── Active Mode: Thinking display + prompt at bottom ──
    if (isActive) {
        return (
            <div className="flex flex-col h-full">
                {/* Status indicator at the top */}
                <div className="flex items-center gap-2 px-2 py-3 shrink-0">
                    {activeStreaming ? (
                        <>
                            <span className="inline-block w-2 h-2 rounded-full bg-accent-secondary animate-[blink-cursor_800ms_steps(1)_infinite]" />
                            <span className="text-accent-secondary text-sm font-medium">Generating...</span>
                        </>
                    ) : (storeGeneratedCode || chunks) ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-green-400 text-sm font-medium">Generation complete</span>
                        </>
                    ) : null}
                </div>

                {/* Error */}
                {error && (
                    <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fade-in shrink-0">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* AI Thinking Section */}
                {displayThinking && (
                    <div className="flex-1 min-h-0 mx-2 mt-1 mb-2 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 px-1 py-2 shrink-0">
                            <span className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Thinking</span>
                            {activeStreaming && !chunks && !storeGeneratedCode && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-tertiary animate-[blink-cursor_800ms_steps(1)_infinite]" />
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto px-1 py-1">
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {displayThinking}
                            </p>
                            <div ref={thinkingEndRef} />
                        </div>
                    </div>
                )}

                {/* Spacer when no thinking */}
                {!displayThinking && <div className="flex-1" />}

                {/* Prompt input at the bottom */}
                <div className="shrink-0 pt-2 px-2 pb-2">
                    <PromptInput
                        value={currentPrompt}
                        onChange={setCurrentPrompt}
                        onSubmit={handleSubmit}
                        isStreaming={activeStreaming}
                    />
                </div>
            </div>
        );
    }

    // ── Home Mode: Full hero + showcase ──
    return (
        <div className="flex flex-col h-full">
            {/* Hero section */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8 animate-fade-in-up w-full">
                {/* Promo Banner */}
                <div className="bg-gradient-promo-banner rounded-full px-4 py-2 flex items-center gap-2 mb-10 border border-white/10 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="text-sm font-medium text-white">
                        Celebrating $100M ARR 🎉, FLAT 75% off on Standard monthly plan.
                    </span>
                    <span className="bg-bg-primary text-white text-xs px-2.5 py-1 rounded-full font-medium ml-2 flex items-center gap-1">
                        Auto applied
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </span>
                </div>

                {/* Project Selector Pill */}
                <div className="glass-pill rounded-full px-3 py-1.5 flex items-center gap-2 mb-6 cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="w-4 h-4 rounded-full bg-linear-to-tr from-orange-400 to-purple-500"></div>
                    <span className="text-sm text-text-primary font-medium">Zam's Project</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </div>

                {/* Main Headline */}
                <div className="text-center w-full mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-semibold text-text-primary mb-4 tracking-tight">
                        Where ideas become reality
                    </h1>
                    <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Build fully functional apps and websites through simple conversations
                    </p>
                </div>
            </div>

            {/* Prompt input */}
            <div className="w-full max-w-3xl mx-auto px-4 z-10">
                <PromptInput
                    value={currentPrompt}
                    onChange={setCurrentPrompt}
                    onSubmit={handleSubmit}
                    isStreaming={isStreaming}
                />
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-3xl mx-auto mt-6 flex flex-wrap justify-center gap-3 px-4 animate-fade-in-up animation-delay-3">
                <button className="glass-pill px-4 py-2 rounded-full text-xs text-text-secondary hover:text-white flex items-center gap-2">
                    <span className="text-error">✦</span> MotiBot <span className="bg-error/20 text-error px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ml-1">New</span>
                </button>
                <button className="glass-pill px-4 py-2 rounded-full text-xs text-text-secondary hover:text-white flex items-center gap-2">
                    <span className="text-text-tertiary">✦</span> My Counter Part
                </button>
                <button className="glass-pill px-4 py-2 rounded-full text-xs text-text-secondary hover:text-white flex items-center gap-2">
                    <span className="text-text-tertiary">✦</span> Bill Generator
                </button>
                <button className="glass-pill px-4 py-2 rounded-full text-xs text-text-secondary hover:text-white flex items-center gap-2">
                    <span className="text-text-tertiary">✦</span> Word of the Day
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Bottom Section - Recent Tasks */}
            <div className="mt-auto pt-16 w-full max-w-5xl mx-auto px-4 animate-fade-in-up animation-delay-5">
                <div className="flex items-center gap-6 border-b border-border-subtle pb-4 mb-4">
                    <button className="flex items-center gap-2 text-text-primary font-medium">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Recent Tasks
                    </button>
                    <span className="text-border-strong">|</span>
                    <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Deployed Apps
                    </button>
                    <div className="flex-1"></div>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                    </button>
                </div>
                {/* Table header */}
                <div className="flex bg-white/5 rounded-t-xl px-6 py-3 border border-border-subtle opacity-50">
                    <div className="w-20 text-xs text-text-tertiary font-semibold uppercase tracking-wider">ID</div>
                    <div className="flex-1 text-xs text-text-tertiary font-semibold uppercase tracking-wider">Task</div>
                    <div className="w-32 text-xs text-text-tertiary font-semibold uppercase tracking-wider text-right">Last Modified</div>
                </div>

                {/* Task List */}
                <div className="bg-bg-elevated/30 border border-t-0 border-border-subtle rounded-b-xl overflow-hidden max-h-[300px] overflow-y-auto">
                    {(entries.length === 0 ? [
                        { id: 'hist_example1', title: 'CRM Dashboard with analytics', timestamp: Date.now() - 3600000 * 2, prompt: 'CRM Dashboard with analytics' },
                        { id: 'hist_example2', title: 'E-commerce landing page', timestamp: Date.now() - 3600000 * 24, prompt: 'E-commerce landing page' },
                        { id: 'hist_example3', title: 'Personal portfolio', timestamp: Date.now() - 3600000 * 48, prompt: 'Personal portfolio' },
                        { id: 'hist_example4', title: 'Task management app', timestamp: Date.now() - 3600000 * 72, prompt: 'Task management app' }
                    ] : entries).map((entry) => (
                        <div key={entry.id} className="flex px-6 py-4 border-b border-border-subtle last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-20 text-sm text-text-secondary font-mono">{entry.id.replace('hist_', '').substring(0, 6)}</div>
                            <div className="flex-1 text-sm text-text-primary truncate pr-4 group-hover:text-accent transition-colors">{entry.title || entry.prompt}</div>
                            <div className="w-32 text-sm text-text-tertiary text-right">{new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    ))
                    }
                </div>

                {/* Showcase Grid */}
                <ShowcaseGrid />
            </div>
        </div>
    );
};
