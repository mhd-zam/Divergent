import React, { useState } from 'react';
import { PromptWorkspace } from '../features/prompt';
import { usePromptStore } from '../features/prompt';
import { PreviewPanel } from '../features/preview';
import { HistorySidebar } from '../features/history';
import { SettingsDrawer } from '../features/settings';
import { useSettingsStore } from '../features/settings';
import { useHealthCheck } from '../shared/hooks/useHealthCheck';
import { IconButton } from '../shared/ui';

const App: React.FC = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { sidebarOpen, toggleSidebar } = useSettingsStore();
    const { isConnected } = useHealthCheck();
    const { showPreview, generatedCode, previewFullscreen, setShowPreview, setPreviewFullscreen } =
        usePromptStore();

    // Get the latest generated code from the stream via the prompt workspace
    // We need the chunks from the useStream hook, but since PromptWorkspace manages it,
    // we'll get the code from the last completed generation via history or direct state
    const chunks = usePromptStore((s) => s.generatedCode);

    return (
        <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
            {/* Top Bar */}
            <header className="shrink-0 h-13 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-sm z-30 animate-fade-in-up">
                {/* Left: Logo + sidebar toggle */}
                <div className="flex items-center gap-3">
                    {!sidebarOpen && (
                        <IconButton size="sm" tooltip="Open sidebar" onClick={toggleSidebar}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </IconButton>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-text-primary tracking-tight">
                            Divergent
                        </span>
                    </div>
                </div>

                {/* Right: Health + Settings */}
                <div className="flex items-center gap-3">
                    {/* Health indicator */}
                    <div className="flex items-center gap-2" title={isConnected ? 'Backend connected' : 'Backend disconnected'}>
                        <span
                            className={`w-2 h-2 rounded-full ${isConnected
                                    ? 'bg-success animate-[pulse-glow_1.5s_ease-in-out_infinite]'
                                    : 'bg-error animate-[pulse-glow-error_1.5s_ease-in-out_infinite]'
                                }`}
                            aria-label={isConnected ? 'Connected' : 'Disconnected'}
                        />
                        <span className="text-xs text-text-tertiary hidden sm:block">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Settings */}
                    <IconButton
                        size="sm"
                        tooltip="Settings"
                        onClick={() => setSettingsOpen(true)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                    </IconButton>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex flex-1 min-h-0">
                {/* History sidebar */}
                <HistorySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

                {/* Workspace */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {showPreview && chunks ? (
                        <PreviewPanel
                            code={chunks}
                            isFullscreen={previewFullscreen}
                            onClose={() => {
                                setShowPreview(false);
                                setPreviewFullscreen(false);
                            }}
                            onToggleFullscreen={() => setPreviewFullscreen(!previewFullscreen)}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                            <PromptWorkspace />
                        </div>
                    )}
                </main>
            </div>

            {/* Settings drawer */}
            <SettingsDrawer
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    );
};

export default App;
