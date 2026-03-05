import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
    isOpen,
    onClose,
}) => {
    const {
        apiBaseUrl,
        theme,
        fontSize,
        setApiBaseUrl,
        toggleTheme,
        setFontSize,
    } = useSettingsStore();

    const [localApiUrl, setLocalApiUrl] = useState(apiBaseUrl);

    const handleSaveApiUrl = () => {
        setApiBaseUrl(localApiUrl);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 z-50 w-[340px] max-w-[90vw]
        glass-panel border-l border-border-subtle
        animate-slide-in-right flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                    <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                        aria-label="Close settings"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Settings content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* Theme */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Theme
                        </label>
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-3 rounded-xl
                bg-bg-input border border-border-subtle
                hover:border-border-strong transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-secondary">
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                )}
                                <span className="text-sm text-text-primary">
                                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                                </span>
                            </div>
                            <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative
                ${theme === 'dark' ? 'bg-accent' : 'bg-bg-elevated'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                  ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`}
                                />
                            </div>
                        </button>
                    </div>

                    {/* Font size */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Code font size
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="10"
                                max="20"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="flex-1 accent-accent"
                            />
                            <span className="text-sm text-text-secondary font-mono w-8 text-right">
                                {fontSize}px
                            </span>
                        </div>
                    </div>

                    {/* API Base URL */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            API Base URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={localApiUrl}
                                onChange={(e) => setLocalApiUrl(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm bg-bg-input border border-border-subtle rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:border-accent focus:outline-none focus:shadow-[0_0_12px_rgba(129,140,248,0.1)]
                  transition-all duration-200"
                                placeholder="http://localhost:5001"
                            />
                            <button
                                onClick={handleSaveApiUrl}
                                className="px-3 py-2 text-sm text-accent bg-accent-muted rounded-lg
                  hover:bg-accent/20 transition-colors duration-200 cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                        <p className="text-xs text-text-tertiary mt-1.5">
                            Requires page reload to take effect
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-border-subtle">
                    <p className="text-text-tertiary text-xs text-center">
                        Divergent v1.0 · Built with ✨
                    </p>
                </div>
            </div>
        </>
    );
};
