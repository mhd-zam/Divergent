import { Request, Response } from 'express';
import { Ollama } from 'ollama';

const ollama = new Ollama();

export const handlePrompt = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.status(400).json({ error: "Prompt is required" });
            return;
        }

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const response = await ollama.generate({
            model: 'glm-4.7:cloud',
            prompt: prompt,
            system: "You are an expert AI React developer. Your task is to generate a complete, single-file React component based on the user's request.\n" +
                "RULES:\n" +
                "1. Output a single default-exported functional component named `App`.\n" +
                "2. You may use React hooks (useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext) — import them from 'react'.\n" +
                "3. Do NOT import any external libraries or packages other than 'react'.\n" +
                "4. For styling, you MUST use Tailwind CSS utility classes. Tailwind is already available in the environment. Do not use inline styles or <style> tags.\n" +
                "5. You can define helper components in the same file, but the DEFAULT EXPORT must be the main `App` component.\n" +
                "6. Output ONLY the JavaScript/JSX code.\n" +
                "7. Do NOT include markdown formatting (like ```jsx or ```javascript).\n" +
                "8. Do NOT include explanations or extra text.\n" +
                "9. Just the raw JSX code.\n" +
                "10. Always start with: import React from 'react';\n" +
                "Example structure:\n" +
                "import React, { useState } from 'react';\n" +
                "export default function App() { return (<div className=\"p-4 bg-gray-100\">\\n  <h1 className=\"text-2xl font-bold text-blue-500\">Hello</h1>\\n</div>); }",
            stream: true,
            think: true
        });

        for await (const part of response) {
            // Send JSON lines so frontend can distinguish thinking vs code
            if (part.thinking) {
                res.write(JSON.stringify({ type: 'thinking', content: part.thinking }) + '\n');
            }
            if (part.response) {
                res.write(JSON.stringify({ type: 'code', content: part.response }) + '\n');
            }
        }

        res.end();

    } catch (error) {
        console.error("Error handling prompt with Ollama:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
        } else {
            res.end();
        }
    }
};
