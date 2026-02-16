"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChatInput } from "../../components/ChatInput";
import { ProjectCard } from "../../components/ProjectCard";
import { BuilderView } from "../../components/BuilderView";
import { mockProjects } from "../../lib/data";
import { Sparkles, Zap, Code2, Rocket, Clock } from "lucide-react";
import { streamPrompt } from "../../services/api";

const suggestions = [
    { emoji: "🎬", label: "Clone YouTube" },
    { emoji: "📋", label: "Task Manager" },
    { emoji: "✍️", label: "AI Pen" },
    { emoji: "🎲", label: "Surprise Me" },
    { emoji: "🚀", label: "Landing Page" },
    { emoji: "🛒", label: "E-commerce Store" },
];

const stats = [
    { icon: Zap, label: "Instant Deploy", value: "< 10s" },
    { icon: Code2, label: "Languages", value: "12+" },
    { icon: Rocket, label: "Apps Built", value: "10K+" },
];

export default function HomePage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [streamingCode, setStreamingCode] = useState("");
    const [viewState, setViewState] = useState<'hero' | 'builder'>('hero');

    const handlePromptSubmit = async (value: string) => {
        try {
            setPrompt(value);
            setViewState('builder');
            setLoading(true);
            setResponse(null);
            setStreamingCode("");
            console.log("Sending prompt:", value);

            // Wait a bit for the "Planning" animation to start before streaming
            await new Promise(resolve => setTimeout(resolve, 1500));

            let accumulatedCode = "";

            await streamPrompt(value, (chunk) => {
                accumulatedCode += chunk;
                setStreamingCode(prev => prev + chunk);
            });

            // Clean up code for preview
            let cleanCode = accumulatedCode;
            cleanCode = cleanCode.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');

            setResponse(cleanCode);

        } catch (error) {
            console.error("Failed to send prompt:", error);
            setStreamingCode(prev => prev + "\n\n[Error: Failed to generate code]");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!response) return;
        const blob = new Blob([response], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        a.click();
    };

    const handleRestart = () => {
        setViewState('hero');
        setPrompt("");
        setResponse(null);
        setStreamingCode("");
        setLoading(false);
    };

    return (
        <div className={viewState === 'hero' ? "max-w-5xl mx-auto px-6 py-12 space-y-12" : "h-[calc(100vh-56px)] overflow-hidden"}>
            <AnimatePresence mode="wait">
                {viewState === 'hero' ? (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {/* ─── Hero ─── */}
                        <div className="max-w-2xl mx-auto text-center pt-10">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-accent" />
                                <span className="text-xs font-medium text-accent">AI-Powered App Builder</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: -14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 }}
                                className="text-4xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-4"
                            >
                                What will you{" "}
                                <span className="bg-linear-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    build
                                </span>{" "}
                                today?
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-sm text-muted-foreground mb-8 max-w-md mx-auto"
                            >
                                Describe your idea and watch it come to life. From concept to deployment in seconds.
                            </motion.p>

                            {/* Input */}
                            <ChatInput onSubmit={handlePromptSubmit} />

                            {/* Suggestion Pills */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="flex flex-wrap items-center justify-center gap-2 mt-6"
                            >
                                {suggestions.map((s, i) => (
                                    <motion.button
                                        key={s.label}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                                        onClick={() => handlePromptSubmit(s.label.toLowerCase().replace(s.emoji, '').trim())}
                                        whileHover={{ scale: 1.06, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-muted border border-card-border bg-card/50 hover:border-accent/30 hover:text-foreground hover:bg-card hover:shadow-md hover:shadow-accent/5 transition-all cursor-pointer"
                                    >
                                        <span className="text-sm">{s.emoji}</span>
                                        {s.label}
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Quick stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center justify-center gap-8 mt-10"
                            >
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-2 text-muted-foreground">
                                        <stat.icon className="w-3.5 h-3.5 text-accent/60" />
                                        <div className="text-left">
                                            <span className="text-[13px] font-semibold text-foreground block leading-tight">{stat.value}</span>
                                            <span className="text-[10px]">{stat.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* ─── Recent Projects ─── */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-between mb-5"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
                                    <span className="text-[11px] text-muted-foreground bg-white/4 px-2 py-0.5 rounded-md">
                                        {mockProjects.length}
                                    </span>
                                </div>
                                <button className="text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer font-medium">
                                    View All →
                                </button>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {mockProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="builder"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full flex flex-col p-14"
                    >
                        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-background/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="opacity-50 text-xs uppercase tracking-wider font-semibold">Project</span>
                                <span className="font-medium bg-accent/10 text-accent px-2 py-0.5 rounded text-xs select-all">"{prompt}"</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleRestart} className="text-xs hover:text-foreground text-muted-foreground transition-colors">Close</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <BuilderView
                                prompt={prompt}
                                streamingCode={streamingCode}
                                isComplete={!loading && !!response}
                                response={response}
                                onDownload={handleDownload}
                                onRestart={handleRestart}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
