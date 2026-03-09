import React, { useState } from 'react';
import { PromptWorkspace } from '../features/prompt';
import { usePromptStore } from '../features/prompt';
import { HistorySidebar } from '../features/history';
import { SettingsDrawer } from '../features/settings';
import { useSettingsStore } from '../features/settings';
import { IconButton, ResizablePanels } from '../shared/ui';
import { RightPanel } from '../features/prompt/components/RightPanel';

const App: React.FC = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { sidebarOpen, toggleSidebar } = useSettingsStore();

    const generatedCode = usePromptStore((s) => s.generatedCode);
    const isStreaming = usePromptStore((s) => s.isStreaming);

    const isActive = !!(generatedCode || isStreaming);

    return (
        <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
            {/* Top Bar */}
            <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-bg-secondary/60 backdrop-blur-md z-30 animate-fade-in-up">
                {/* Left: Home */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-text-primary font-medium text-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Home
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Buy Credits Button */}
                    <button className="btn-gold-glow flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mr-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Buy Credits
                    </button>

                    {/* Notification Icon */}
                    <IconButton size="sm" tooltip="Notifications">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </IconButton>

                    {/* Gift Icon */}
                    <IconButton size="sm" tooltip="Rewards">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 12 20 22 4 22 4 12"></polyline>
                            <rect x="2" y="7" width="20" height="5"></rect>
                            <line x1="12" y1="22" x2="12" y2="7"></line>
                            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                        </svg>
                    </IconButton>

                    {/* Profile Avatar / Settings */}
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors ml-1"
                    >
                        <span className="text-xs font-bold font-mono">tt</span>
                    </button>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex flex-1 min-h-0">
                {/* History sidebar */}
                <HistorySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

                {/* Workspace */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {isActive ? (
                        /* Split layout: Left = Prompt + AI thinking, Right = Preview/Code */
                        <ResizablePanels
                            left={
                                <div className="flex-1 flex flex-col p-4 overflow-y-auto h-full">
                                    <PromptWorkspace />
                                </div>
                            }
                            right={
                                <RightPanel
                                    code={generatedCode}
                                    isStreaming={isStreaming}
                                />
                            }
                            defaultLeftWidth={45}
                            minLeftWidth={25}
                            maxLeftWidth={70}
                        />
                    ) : (
                        /* Home view */
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
