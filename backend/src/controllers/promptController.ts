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
            system: "You are an expert AI web developer. Your task is to generate a complete, single-file HTML application based on the user's request. \n" +
                "Include all necessary CSS and JavaScript within the HTML file. \n" +
                "Output ONLY the HTML code. \n" +
                "Do NOT include markdown formatting (like ```html). \n" +
                "Do NOT include explanations or extra text. \n" +
                "Just the raw HTML code.",
            stream: true
        });

        for await (const part of response) {
            res.write(part.response);
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
