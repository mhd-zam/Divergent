import { create } from 'zustand';

interface PromptState {
    currentPrompt: string;
    generatedCode: string;
    thinkingText: string;
    isStreaming: boolean;
    error: string | null;
    showPreview: boolean;
    previewFullscreen: boolean;

    setCurrentPrompt: (prompt: string) => void;
    setGeneratedCode: (code: string) => void;
    setThinkingText: (text: string) => void;
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
    thinkingText: '',
    isStreaming: false,
    error: null,
    showPreview: false,
    previewFullscreen: false,

    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
    setGeneratedCode: (code) => set({ generatedCode: code }),
    setThinkingText: (text) => set({ thinkingText: text }),
    appendChunk: (chunk) =>
        set((state) => ({ generatedCode: state.generatedCode + chunk })),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    setError: (error) => set({ error }),
    setShowPreview: (show) => set({ showPreview: show }),
    setPreviewFullscreen: (fullscreen) => set({ previewFullscreen: fullscreen }),
    resetGeneration: () =>
        set({
            generatedCode: '',
            thinkingText: '',
            isStreaming: false,
            error: null,
            showPreview: false,
        }),
}));
