import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendPrompt = async (prompt: string) => {
    try {
        const response = await api.post('/prompt', { prompt });
        return response.data;
    } catch (error) {
        console.error('Error sending prompt:', error);
        throw error;
    }
};

export const streamPrompt = async (
    prompt: string,
    onChunk: (chunk: string) => void
) => {
    try {
        const response = await fetch(`${API_URL}/prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            onChunk(text);
        }
    } catch (error) {
        console.error('Error streaming prompt:', error);
        throw error;
    }
};

export default api;
