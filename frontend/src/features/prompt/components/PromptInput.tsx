import React, { useRef, useEffect, useState } from 'react';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isStreaming: boolean;
    disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
    value,
    onChange,
    onSubmit,
    isStreaming,
    disabled,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [activeTab, setActiveTab] = useState<'fullstack' | 'mobile' | 'landing'>('fullstack');

    useEffect(() => {
        if (!isStreaming && textareaRef.current) {
            textareaRef.current.focus();

            // Auto resize
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
        }
    }, [isStreaming, value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Enter = submit, Shift+Enter = newline
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isStreaming && value.trim()) {
                onSubmit();
            }
        }
    };

    return (
        <div className="animate-fade-in-up animation-delay-2 w-full">
            <div className="input-container-glow rounded-3xl overflow-hidden flex flex-col transition-all duration-300">
                {/* Top Tabs */}
                <div className="flex items-center gap-1 border-b border-border-subtle p-2">
                    <button
                        onClick={() => setActiveTab('fullstack')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'fullstack' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Full Stack App
                    </button>
                    <button
                        onClick={() => setActiveTab('mobile')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'mobile' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                        Mobile App
                    </button>
                    <button
                        onClick={() => setActiveTab('landing')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'landing' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                        </svg>
                        Landing Page
                    </button>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    id="prompt-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Build me a CRM system with..."
                    disabled={isStreaming || disabled}
                    rows={4}
                    aria-label="Prompt input"
                    className={`
                        w-full resize-none bg-transparent p-5 text-text-primary text-base leading-relaxed
                        placeholder:text-text-tertiary transition-all duration-200 font-[inherit]
                        ${isStreaming ? 'opacity-60 cursor-not-allowed' : ''}
                        focus:outline-none border-none focus:ring-0 min-h-[120px] max-h-[400px] overflow-y-auto
                    `}
                />

                {/* Bottom Toolbar */}
                <div className="flex items-center justify-between p-3">
                    {/* Left Actions */}
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors" title="Attach file">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                            </svg>
                        </button>
                        <button className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors" title="Import from GitHub">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-strong text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            Claude 4.5 Sonnet
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-white transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            Public
                        </button>

                        <button className="text-text-secondary hover:text-white transition-colors" title="Credits">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                                <rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect>
                                <line x1="9" y1="8" x2="9" y2="16"></line>
                                <line x1="15" y1="8" x2="15" y2="16"></line>
                            </svg>
                        </button>

                        <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white transition-colors" title="Voice Input">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="22"></line>
                            </svg>
                        </button>

                        {/* Submit Button */}
                        <button
                            onClick={onSubmit}
                            disabled={!value.trim() || isStreaming || disabled}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!value.trim() || isStreaming || disabled ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-md'}`}
                        >
                            {isStreaming ? (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="2" x2="12" y2="6"></line>
                                    <line x1="12" y1="18" x2="12" y2="22"></line>
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                    <line x1="2" y1="12" x2="6" y2="12"></line>
                                    <line x1="18" y1="12" x2="22" y2="12"></line>
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
