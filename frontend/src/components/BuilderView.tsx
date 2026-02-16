"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
    Terminal,
    CheckCircle2,
    Circle,
    Loader2,
    Play,
    Maximize2,
    Download,
    RefreshCw,
    Laptop,
    Code
} from "lucide-react";

interface BuilderViewProps {
    prompt: string;
    streamingCode: string;
    isComplete: boolean;
    response: string | null;
    onDownload: () => void;
    onRestart: () => void;
}

type Step = {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed';
};

export function BuilderView({
    prompt,
    streamingCode,
    isComplete,
    response,
    onDownload,
    onRestart
}: BuilderViewProps) {
    // We simulate a "Planning" step before the code actually starts visually streaming effectively
    const [steps, setSteps] = useState<Step[]>([
        { id: '1', label: 'Analyzing Requirements', status: 'completed' },
        { id: '2', label: 'Drafting Architecture', status: 'running' },
        { id: '3', label: 'Generating Frontend', status: 'pending' },
        { id: '4', label: 'Finalizing Build', status: 'pending' },
    ]);

    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [streamingCode]);

    // Simulate step progression based on streaming code length
    useEffect(() => {
        if (streamingCode.length > 50 && steps[1].status === 'running') {
            setSteps(prev => prev.map(s =>
                s.id === '2' ? { ...s, status: 'completed' } :
                    s.id === '3' ? { ...s, status: 'running' } : s
            ));
        }
        if (isComplete) {
            setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
        }
    }, [streamingCode, isComplete]);

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-4">
            {/* Left Panel: Agent Log & Terminal */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/3 flex flex-col gap-4"
            >
                {/* Steps Card */}
                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-accent/10 rounded-md">
                            <Laptop className="w-4 h-4 text-accent" />
                        </div>
                        <h3 className="font-semibold text-sm">Builder Agent</h3>
                    </div>

                    <div className="space-y-3">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    {step.status === 'completed' && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    )}
                                    {step.status === 'running' && (
                                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                    )}
                                    {step.status === 'pending' && (
                                        <Circle className="w-5 h-5 text-muted-foreground/30" />
                                    )}
                                    {idx < steps.length - 1 && (
                                        <div className={`absolute top-5 w-px h-3 ${step.status === 'completed' ? 'bg-green-500/50' : 'bg-muted-foreground/20'}`} />
                                    )}
                                </div>
                                <span className={`text-xs ${step.status === 'running' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terminal Card */}
                <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-mono">console</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div
                        ref={scrollRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-green-400/90"
                    >
                        <pre className="whitespace-pre-wrap break-all">
                            {streamingCode}
                            {!isComplete && <span className="animate-pulse">_</span>}
                        </pre>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel: Preview */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-2/3 flex flex-col bg-card border border-card-border rounded-xl shadow-sm overflow-hidden"
            >
                {/* Toolbar */}
                <div className="h-14 border-b border-card-border flex items-center justify-between px-4 bg-card/50">
                    <div className="flex bg-muted/20 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-black' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'code' ? 'bg-white shadow-sm text-black' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Code className="w-3.5 h-3.5 inline mr-1.5" />
                            Source
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isComplete && (
                            <button
                                onClick={onDownload}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-hover transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Export
                            </button>
                        )}
                        <button
                            onClick={onRestart}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"
                            title="New Chat"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative bg-white/50 dark:bg-black/20">
                    {activeTab === 'preview' ? (
                        response ? (
                            <iframe
                                srcDoc={response}
                                title="App Preview"
                                className="w-full h-full border-none bg-white"
                                sandbox="allow-scripts allow-forms allow-same-origin"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                                    <Laptop className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="text-sm font-medium">Building your application...</p>
                                <p className="text-xs opacity-60 mt-1">The preview will appear here automatically.</p>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full bg-[#1e1e1e] p-4 overflow-auto">
                            <pre className="text-xs font-mono text-blue-300 whitespace-pre-wrap">
                                {streamingCode || "// Waiting for code generation..."}
                            </pre>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
