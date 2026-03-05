import { create } from 'zustand';

interface PromptState {
    currentPrompt: string;
    generatedCode: string;
    isStreaming: boolean;
    error: string | null;
    showPreview: boolean;
    previewFullscreen: boolean;

    setCurrentPrompt: (prompt: string) => void;
    setGeneratedCode: (code: string) => void;
    appendChunk: (chunk: string) => void;
    setIsStreaming: (isStreaming: boolean) => void;
    setError: (error: string | null) => void;
    setShowPreview: (show: boolean) => void;
    setPreviewFullscreen: (fullscreen: boolean) => void;
    resetGeneration: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
    currentPrompt: '',
    generatedCode: '',
    isStreaming: false,
    error: null,
    showPreview: false,
    previewFullscreen: false,

    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
    setGeneratedCode: (code) => set({ generatedCode: code }),
    appendChunk: (chunk) =>
        set((state) => ({ generatedCode: state.generatedCode + chunk })),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    setError: (error) => set({ error }),
    setShowPreview: (show) => set({ showPreview: show }),
    setPreviewFullscreen: (fullscreen) => set({ previewFullscreen: fullscreen }),
    resetGeneration: () =>
        set({
            generatedCode: '',
            isStreaming: false,
            error: null,
            showPreview: false,
        }),
}));
