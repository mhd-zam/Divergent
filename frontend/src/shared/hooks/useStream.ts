import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/apiClient';

interface UseStreamReturn {
    chunks: string;
    isStreaming: boolean;
    error: string | null;
    startStream: (prompt: string) => Promise<void>;
    stopStream: () => void;
    reset: () => void;
}

/**
 * Custom hook for consuming streamed responses from the API.
 * Uses ReadableStream for chunked response consumption.
 */
export function useStream(): UseStreamReturn {
    const [chunks, setChunks] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

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
    }, []);

    const reset = useCallback(() => {
        stopStream();
        setChunks('');
        setError(null);
    }, [stopStream]);

    const startStream = useCallback(async (prompt: string) => {
        // Reset state
        setChunks('');
        setIsStreaming(true);
        setError(null);

        try {
            const reader = await apiClient.stream('/api/prompt', { prompt });
            readerRef.current = reader;
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const decoded = decoder.decode(value, { stream: true });
                setChunks((prev) => prev + decoded);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Stream was intentionally stopped
                return;
            }
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsStreaming(false);
            readerRef.current = null;
        }
    }, []);

    return { chunks, isStreaming, error, startStream, stopStream, reset };
}
