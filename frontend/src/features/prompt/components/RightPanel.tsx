import React, { useState, useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import { copyToClipboard, downloadFile } from '../../../shared/lib/helpers';
import { SandpackPreview } from './SandpackPreview';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);

type RightTab = 'preview' | 'code';

interface RightPanelProps {
    code: string;
    isStreaming: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({ code, isStreaming }) => {
    const [activeTab, setActiveTab] = useState<RightTab>('preview');
    const [copied, setCopied] = useState(false);
    const codeContainerRef = useRef<HTMLDivElement>(null);

    // Auto-switch to preview once streaming completes
    useEffect(() => {
        if (!isStreaming && code) {
            setActiveTab('preview');
        }
    }, [isStreaming, code]);

    // Auto-scroll code while streaming
    useEffect(() => {
        if (isStreaming && activeTab === 'code' && codeContainerRef.current) {
            codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
        }
    }, [code, isStreaming, activeTab]);

    const highlightedCode = useMemo(() => {
        if (!code) return '';
        try {
            return hljs.highlight(code, { language: 'javascript' }).value;
        } catch {
            return code;
        }
    }, [code]);

    const handleCopy = async () => {
        const success = await copyToClipboard(code);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        downloadFile(code, 'divergent-generated.jsx');
    };

    const handleOpenInNewTab = () => {
        // Build a self-contained HTML page with Babel for JSX compilation
        const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8" />
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}#root{min-height:100vh}</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
<script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<script src="https://cdn.tailwindcss.com"><\/script>
</head><body><div id="root"></div>
<script type="text/babel" data-type="module">
${code}
const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(React.createElement(typeof App !== 'undefined' ? App : (() => React.createElement('div', null, 'No App component found'))));
<\/script></body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col h-full bg-bg-primary">
            {/* Tab Bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === 'preview'
                                ? 'bg-white/10 text-white'
                                : 'text-text-tertiary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === 'code'
                                ? 'bg-white/10 text-white'
                                : 'text-text-tertiary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                        Code
                        {isStreaming && (
                            <span className="flex items-center gap-1 text-accent-secondary text-xs">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-secondary animate-[blink-cursor_800ms_steps(1)_infinite]" />
                            </span>
                        )}
                    </button>
                </div>

                {/* Actions (visible in code tab) */}
                {activeTab === 'code' && !isStreaming && code && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {copied ? (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                                    Copy
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download
                        </button>
                    </div>
                )}

                {/* Open in new tab (visible in preview tab) */}
                {activeTab === 'preview' && code && !isStreaming && (
                    <button
                        onClick={handleOpenInNewTab}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        title="Open in new tab"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Open in new tab
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {activeTab === 'preview' ? (
                    /* Preview: Sandpack renders the React component */
                    <div className="w-full h-full">
                        <SandpackPreview code={code} isStreaming={isStreaming} />
                    </div>
                ) : (
                    /* Code: syntax-highlighted source */
                    <div ref={codeContainerRef} className="h-full overflow-auto bg-bg-input p-4">
                        <pre className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
                            <code
                                className="hljs"
                                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                            />
                            {isStreaming && (
                                <span
                                    className="inline-block w-2 h-4 ml-0.5 align-middle bg-accent-secondary animate-[blink-cursor_800ms_steps(1)_infinite]"
                                    aria-hidden="true"
                                />
                            )}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};
