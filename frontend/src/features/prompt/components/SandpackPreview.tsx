import React, { useMemo, useRef, useEffect } from 'react';

interface SandpackPreviewProps {
    code: string;
    isStreaming: boolean;
}

/**
 * Strips ES module import/export statements and prepares code
 * for execution in a UMD environment where React globals exist on window.
 */
function prepareCodeForUMD(code: string): string {
    // Remove import statements for 'react' (already available as UMD globals)
    let prepared = code.replace(
        /^\s*import\s+(?:React\s*,?\s*)?(?:\{[^}]*\})?\s*from\s*['"]react['"];?\s*$/gm,
        ''
    );

    // Also handle standalone: import React from 'react';
    prepared = prepared.replace(
        /^\s*import\s+React\s+from\s*['"]react['"];?\s*$/gm,
        ''
    );

    // Destructure React hooks into local scope for convenience
    const { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, useId, useTransition, useDeferredValue, useSyncExternalStore, useInsertionEffect, useLayoutEffect, useImperativeHandle, useDebugValue, Fragment, createContext, forwardRef, memo, lazy, Suspense, StrictMode, Component, PureComponent, Children, cloneElement, createElement, isValidElement, createRef } = React as any;
    void useState; void useEffect; void useRef; void useMemo; void useCallback; void useReducer; void useContext;

    // Replace 'export default function' with just 'function'
    prepared = prepared.replace(
        /^\s*export\s+default\s+function\s+/gm,
        'function '
    );

    // Replace 'export default class' with just 'class'
    prepared = prepared.replace(
        /^\s*export\s+default\s+class\s+/gm,
        'class '
    );

    // Replace 'export default' (for arrow functions / expressions assigned to const)
    // e.g., export default () => ... or export default App;
    prepared = prepared.replace(
        /^\s*export\s+default\s+/gm,
        'var _defaultExport = '
    );

    // Remove any remaining named exports
    prepared = prepared.replace(
        /^\s*export\s+(?:const|let|var|function|class)\s+/gm,
        (match) => match.replace('export ', '')
    );

    return prepared;
}

/**
 * Builds a self-contained HTML document that loads React 18 UMD builds
 * from CDN, then runs the AI-generated code directly (no Babel needed
 * since we strip imports/exports and the code uses React globals).
 *
 * For JSX support, we include Babel Standalone which compiles JSX in-browser.
 */
function buildPreviewHtml(code: string): string {
    // Extract <style>...</style> blocks from JSX if present
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let css = '';
    let match;
    while ((match = styleRegex.exec(code)) !== null) {
        css += match[1] + '\n';
    }
    const cleanCode = code.replace(styleRegex, '').trim();

    // Prepare the code for UMD execution
    const preparedCode = prepareCodeForUMD(cleanCode);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #root { min-height: 100vh; }
        ${css}
    </style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
    <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
    <div id="root"></div>
    <script>
        // Error handler to display errors in the preview
        window.onerror = function(msg, url, line, col, error) {
            var root = document.getElementById('root');
            if (root) {
                root.innerHTML = '<div style="padding:24px;font-family:monospace;color:#ef4444;background:#1a1a2e;min-height:100vh;">' +
                    '<h3 style="margin-bottom:12px;color:#f87171;">⚠ Runtime Error</h3>' +
                    '<pre style="white-space:pre-wrap;font-size:13px;color:#fca5a5;">' + msg + '</pre>' +
                    (line ? '<p style="margin-top:8px;color:#6b7280;font-size:12px;">Line ' + line + '</p>' : '') +
                    '</div>';
            }
            return true;
        };
    <\/script>
    <script type="text/babel">
        // Destructure all React hooks and utilities into local scope
        const { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext,
                useId, useLayoutEffect, useImperativeHandle, useDebugValue,
                Fragment, createContext, forwardRef, memo, lazy, Suspense, StrictMode,
                Component, PureComponent, Children, cloneElement, createElement,
                isValidElement, createRef } = React;

${preparedCode}

        // Mount the App component
        try {
            const _appComponent = typeof App !== 'undefined' ? App
                                : typeof _defaultExport !== 'undefined' ? _defaultExport
                                : null;
            if (_appComponent) {
                const _root = ReactDOM.createRoot(document.getElementById('root'));
                _root.render(React.createElement(_appComponent));
            } else {
                document.getElementById('root').innerHTML =
                    '<div style="padding:24px;color:#f59e0b;font-family:sans-serif;">' +
                    '<h3>⚠ No App component found</h3>' +
                    '<p style="margin-top:8px;color:#9ca3af;">The generated code should export a default function named App.</p></div>';
            }
        } catch (e) {
            document.getElementById('root').innerHTML =
                '<div style="padding:24px;font-family:monospace;color:#ef4444;background:#1a1a2e;min-height:100vh;">' +
                '<h3 style="margin-bottom:12px;color:#f87171;">⚠ Render Error</h3>' +
                '<pre style="white-space:pre-wrap;font-size:13px;color:#fca5a5;">' + e.message + '</pre></div>';
        }
    <\/script>
</body>
</html>`;
}

export const SandpackPreview: React.FC<SandpackPreviewProps> = ({ code, isStreaming }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Build the preview HTML whenever code changes (and not streaming)
    const previewHtml = useMemo(() => {
        if (!code || !code.trim() || isStreaming) return null;
        return buildPreviewHtml(code);
    }, [code, isStreaming]);

    // Write to iframe using srcdoc
    useEffect(() => {
        if (iframeRef.current && previewHtml) {
            iframeRef.current.srcdoc = previewHtml;
        }
    }, [previewHtml]);

    // Show placeholder when no code is available
    if (!code || !code.trim()) {
        return (
            <div className="flex items-center justify-center h-full bg-bg-primary">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <p className="text-text-tertiary text-sm">Preview will appear here</p>
                </div>
            </div>
        );
    }

    // While streaming, show a loading indicator
    if (isStreaming) {
        return (
            <div className="flex items-center justify-center h-full bg-bg-primary">
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-accent-secondary animate-[blink-cursor_800ms_steps(1)_infinite]" />
                        <span className="text-accent-secondary text-sm font-medium">Building preview...</span>
                    </div>
                    <p className="text-text-tertiary text-xs">
                        The live preview will render once generation completes
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-white">
            <iframe
                ref={iframeRef}
                id="preview-iframe"
                srcDoc={previewHtml || ''}
                sandbox="allow-scripts allow-same-origin"
                title="React Preview"
                className="w-full h-full border-none"
            />
        </div>
    );
};
