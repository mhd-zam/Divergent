import React, { useCallback } from 'react';
import { PromptInput } from './PromptInput';
import { CodeDisplay } from './CodeDisplay';
import { useStream } from '../../../shared/hooks/useStream';
import { usePromptStore } from '../store/promptStore';
import { useHistoryStore } from '../../history/store/historyStore';

export const PromptWorkspace: React.FC = () => {
    const {
        currentPrompt,
        setCurrentPrompt,
        setShowPreview,
    } = usePromptStore();

    const { chunks, isStreaming, error, startStream } = useStream();
    const addEntry = useHistoryStore((s) => s.addEntry);

    const handleSubmit = useCallback(async () => {
        if (!currentPrompt.trim() || isStreaming) return;
        await startStream(currentPrompt);
    }, [currentPrompt, isStreaming, startStream]);

    // Save to history when streaming completes
    React.useEffect(() => {
        if (!isStreaming && chunks && currentPrompt.trim()) {
            addEntry(currentPrompt, chunks);
        }
        // Only run when streaming stops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    return (
        <div className="flex flex-col h-full">
            {/* Hero section when no code generated */}
            {!chunks && !isStreaming && (
                <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">
                            What will you build?
                        </h1>
                        <p className="text-text-secondary text-base max-w-md mx-auto leading-relaxed">
                            Describe your idea and Divergent will generate a complete, working
                            HTML application in seconds.
                        </p>
                    </div>
                </div>
            )}

            {/* Prompt input */}
            <div className={chunks || isStreaming ? 'shrink-0' : 'w-full max-w-2xl mx-auto px-4'}>
                <PromptInput
                    value={currentPrompt}
                    onChange={setCurrentPrompt}
                    onSubmit={handleSubmit}
                    isStreaming={isStreaming}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="mt-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Code display */}
            {(chunks || isStreaming) && (
                <div className="flex-1 min-h-0 mt-2 overflow-hidden">
                    <CodeDisplay
                        code={chunks}
                        isStreaming={isStreaming}
                        onPreview={() => setShowPreview(true)}
                    />
                </div>
            )}
        </div>
    );
};
