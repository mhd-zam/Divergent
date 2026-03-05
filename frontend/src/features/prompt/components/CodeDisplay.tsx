import React, { useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import { Button, IconButton } from '../../../shared/ui';
import { copyToClipboard, downloadFile } from '../../../shared/lib/helpers';

// Register highlight.js languages
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);

interface CodeDisplayProps {
    code: string;
    isStreaming: boolean;
    onPreview: () => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
    code,
    isStreaming,
    onPreview,
}) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = React.useState(false);

    // Auto-scroll to bottom while streaming
    useEffect(() => {
        if (isStreaming && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [code, isStreaming]);

    const highlightedCode = useMemo(() => {
        if (!code) return '';
        try {
            return hljs.highlight(code, { language: 'xml' }).value;
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
        downloadFile(code, 'divergent-generated.html');
    };

    if (!code && !isStreaming) return null;

    return (
        <div className="animate-fade-in-up animation-delay-4 mt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-text-tertiary text-xs font-mono ml-2">
                        generated.html
                    </span>
                    {isStreaming && (
                        <span className="flex items-center gap-1.5 text-accent-secondary text-xs font-medium">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-secondary animate-[blink-cursor_800ms_steps(1)_infinite]" />
                            Streaming...
                        </span>
                    )}
                </div>

                {/* Line count */}
                <span className="text-text-tertiary text-xs font-mono">
                    {code.split('\n').length} lines
                </span>
            </div>

            {/* Code area */}
            <div
                ref={containerRef}
                className="relative rounded-xl border border-border-subtle bg-bg-input overflow-auto"
                style={{ maxHeight: '50vh' }}
            >
                <pre
                    ref={codeRef}
                    className="p-4 text-sm leading-relaxed overflow-x-auto"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
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

            {/* Action buttons — show only when streaming is complete */}
            {!isStreaming && code && (
                <div className="flex items-center gap-2 mt-3 animate-fade-in">
                    <Button variant="primary" size="sm" onClick={onPreview}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                    </Button>

                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                        {copied ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Copy Code
                            </>
                        )}
                    </Button>

                    <Button variant="secondary" size="sm" onClick={handleDownload}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download .html
                    </Button>
                </div>
            )}
        </div>
    );
};
