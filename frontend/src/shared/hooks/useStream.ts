import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/apiClient';
import { usePromptStore } from '../../features/prompt/store/promptStore';

interface UseStreamReturn {
    chunks: string;
    thinking: string;
    isStreaming: boolean;
    error: string | null;
    startStream: (prompt: string) => Promise<void>;
    stopStream: () => void;
    reset: () => void;
}

/**
 * Custom hook for consuming streamed JSON-line responses from the API.
 * Parses `{ type: 'thinking' | 'code', content }` lines and accumulates
 * them into separate thinking and code strings.
 */
export function useStream(): UseStreamReturn {
    const [chunks, setChunks] = useState<string>('');
    const [thinking, setThinking] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
    const chunksRef = useRef<string>('');
    const thinkingRef = useRef<string>('');

    const stopStream = useCallback(() => {
        if (readerRef.current) {
            readerRef.current.cancel();
            readerRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
        usePromptStore.getState().setIsStreaming(false);
    }, []);

    const reset = useCallback(() => {
        stopStream();
        setChunks('');
        setThinking('');
        chunksRef.current = '';
        thinkingRef.current = '';
        setError(null);
        usePromptStore.getState().setGeneratedCode('');
        usePromptStore.getState().setThinkingText('');
    }, [stopStream]);

    const startStream = useCallback(async (prompt: string) => {
        // Reset all state
        chunksRef.current = '';
        thinkingRef.current = '';
        setChunks('');
        setThinking('');
        setIsStreaming(true);
        setError(null);
        usePromptStore.getState().setGeneratedCode('');
        usePromptStore.getState().setThinkingText('');
        usePromptStore.getState().setIsStreaming(true);

        let buffer = ''; // Buffer for incomplete JSON lines

        try {
            const reader = await apiClient.stream('/api/prompt', { prompt });
            readerRef.current = reader;
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const decoded = decoder.decode(value, { stream: true });

                buffer += decoded;
                const lines = buffer.split('\n');
                // Keep the last (possibly incomplete) line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const parsed = JSON.parse(trimmed);
                        if (parsed.type === 'thinking' && parsed.content) {
                            thinkingRef.current += parsed.content;
                            usePromptStore.getState().setThinkingText(thinkingRef.current);
                            setThinking(thinkingRef.current);
                        } else if (parsed.type === 'code' && parsed.content) {
                            chunksRef.current += parsed.content;
                            usePromptStore.getState().setGeneratedCode(chunksRef.current);
                            setChunks(chunksRef.current);
                        }
                    } catch {
                        // Not valid JSON — treat as raw code (backward compat)
                        chunksRef.current += trimmed;
                        usePromptStore.getState().setGeneratedCode(chunksRef.current);
                        setChunks(chunksRef.current);
                    }
                }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
                try {
                    const parsed = JSON.parse(buffer.trim());
                    if (parsed.type === 'thinking' && parsed.content) {
                        thinkingRef.current += parsed.content;
                        usePromptStore.getState().setThinkingText(thinkingRef.current);
                        setThinking(thinkingRef.current);
                    } else if (parsed.type === 'code' && parsed.content) {
                        chunksRef.current += parsed.content;
                        usePromptStore.getState().setGeneratedCode(chunksRef.current);
                        setChunks(chunksRef.current);
                    }
                } catch {
                    chunksRef.current += buffer.trim();
                    usePromptStore.getState().setGeneratedCode(chunksRef.current);
                    setChunks(chunksRef.current);
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsStreaming(false);
            usePromptStore.getState().setIsStreaming(false);
            readerRef.current = null;
        }
    }, []);

    return { chunks, thinking, isStreaming, error, startStream, stopStream, reset };
}
