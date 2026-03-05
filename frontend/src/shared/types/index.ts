// ========================================
// Divergent — Global TypeScript Types
// ========================================

/** Request body for POST /api/prompt */
export interface PromptRequest {
    prompt: string;
}

/** Response from GET /api/health */
export interface HealthResponse {
    status: 'ok' | 'error';
    message: string;
}

/** State of a streaming operation */
export interface StreamState {
    chunks: string;
    isStreaming: boolean;
    error: string | null;
}

/** A saved prompt history entry */
export interface HistoryEntry {
    id: string;
    prompt: string;
    generatedCode: string;
    timestamp: number;
    title: string;
}

/** Preview viewport sizes */
export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

/** Theme mode */
export type ThemeMode = 'dark' | 'light';

/** App settings */
export interface AppSettings {
    apiBaseUrl: string;
    theme: ThemeMode;
    fontSize: number;
}
