import React, { useState } from 'react';
import { IconButton, Button } from '../../../shared/ui';
import type { ViewportSize } from '../../../shared/types';

interface PreviewPanelProps {
    code: string;
    isFullscreen: boolean;
    onClose: () => void;
    onToggleFullscreen: () => void;
}

const viewportWidths: Record<ViewportSize, number> = {
    desktop: 1280,
    tablet: 768,
    mobile: 375,
};

const viewportIcons: Record<ViewportSize, React.ReactNode> = {
    desktop: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    ),
    tablet: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
    mobile: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    code,
    isFullscreen,
    onClose,
    onToggleFullscreen,
}) => {
    const [viewport, setViewport] = useState<ViewportSize>('desktop');

    const containerClasses = isFullscreen
        ? 'fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm flex flex-col animate-fade-in'
        : 'flex flex-col h-full animate-fade-in';

    return (
        <div className={containerClasses}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-bg-secondary shrink-0">
                <div className="flex items-center gap-1">
                    <span className="text-text-secondary text-sm font-medium mr-3">Preview</span>
                    {(Object.keys(viewportWidths) as ViewportSize[]).map((size) => (
                        <IconButton
                            key={size}
                            size="sm"
                            tooltip={`${size.charAt(0).toUpperCase() + size.slice(1)} view`}
                            onClick={() => setViewport(size)}
                            className={viewport === size ? 'bg-bg-elevated text-accent' : ''}
                        >
                            {viewportIcons[size]}
                        </IconButton>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-text-tertiary text-xs font-mono mr-2">
                        {viewportWidths[viewport]}px
                    </span>
                    <IconButton
                        size="sm"
                        tooltip={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        onClick={onToggleFullscreen}
                    >
                        {isFullscreen ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 14 10 14 10 20" />
                                <polyline points="20 10 14 10 14 4" />
                                <line x1="14" y1="10" x2="21" y2="3" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        )}
                    </IconButton>
                    <IconButton size="sm" tooltip="Close preview" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </IconButton>
                </div>
            </div>

            {/* Preview iframe */}
            <div className="flex-1 flex items-start justify-center p-4 overflow-auto bg-bg-primary">
                <div
                    className="border border-border-subtle rounded-xl overflow-hidden bg-white transition-all duration-300 shadow-elevated h-full"
                    style={{
                        width: `${viewportWidths[viewport]}px`,
                        maxWidth: '100%',
                    }}
                >
                    <iframe
                        id="preview-iframe"
                        srcDoc={code}
                        sandbox="allow-scripts"
                        title="Generated HTML Preview"
                        className="w-full h-full border-none"
                        style={{ minHeight: isFullscreen ? 'calc(100vh - 56px)' : '500px' }}
                    />
                </div>
            </div>
        </div>
    );
};
