// ========================================
// Divergent — API Client
// Centralized fetch wrapper. Features never call fetch directly.
// ========================================

const getBaseUrl = (): string => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
};

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

/**
 * Fetch wrapper with JSON defaults and error normalization.
 */
async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { body, headers, ...rest } = options;

    const res = await fetch(`${getBaseUrl()}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    if (!res.ok) {
        throw new ApiError(res.status, `Request failed: ${res.statusText}`);
    }

    return res.json();
}

/**
 * Streaming fetch — returns the ReadableStream reader.
 */
async function streamRequest(
    endpoint: string,
    body: unknown
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const res = await fetch(`${getBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) {
        throw new ApiError(res.status || 500, 'Stream request failed');
    }

    return res.body.getReader();
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'POST', body }),
    stream: (endpoint: string, body: unknown) => streamRequest(endpoint, body),
};
