"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
    CheckCircle2,
    Circle,
    Loader2,
    Laptop,
    Code,
    Download,
    RefreshCw,
    Send,
    Bot,
    Sparkles,
    ChevronDown,
} from "lucide-react";

interface BuilderViewProps {
    prompt: string;
    streamingCode: string;
    isComplete: boolean;
    response: string | null;
    onDownload: () => void;
    onRestart: () => void;
    onChatSubmit?: (message: string) => void;
}

type Step = {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed';
};

type ThinkingMessage = {
    id: string;
    text: string;
    status: 'typing' | 'done';
};

type ChatMessage = {
    id: string;
    role: 'user' | 'ai';
    text: string;
};

export function BuilderView({
    prompt,
    streamingCode,
    isComplete,
    response,
    onDownload,
    onRestart,
    onChatSubmit,
}: BuilderViewProps) {
    const [steps, setSteps] = useState<Step[]>([
        { id: '1', label: 'Analyzing Requirements', status: 'completed' },
        { id: '2', label: 'Drafting Architecture', status: 'running' },
        { id: '3', label: 'Generating Frontend', status: 'pending' },
        { id: '4', label: 'Finalizing Build', status: 'pending' },
    ]);

    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [thinkingMessages, setThinkingMessages] = useState<ThinkingMessage[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [showThinkingDetail, setShowThinkingDetail] = useState(true);

    const thinkingScrollRef = useRef<HTMLDivElement>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Thinking messages that appear during the build
    const thinkingSequence = [
        { delay: 300, text: "Analyzing your prompt..." },
        { delay: 1800, text: `Understanding requirements for "${prompt}"` },
        { delay: 3200, text: "Deciding on component structure..." },
        { delay: 5000, text: "Scaffolding main layout..." },
        { delay: 7500, text: "Generating frontend code..." },
        { delay: 10000, text: "Adding styles and interactions..." },
        { delay: 13000, text: "Optimizing and polishing..." },
    ];

    // Trigger thinking messages on mount
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        thinkingSequence.forEach((msg, idx) => {
            const timer = setTimeout(() => {
                setThinkingMessages(prev => {
                    // Mark previous messages as 'done'
                    const updated = prev.map(m => ({ ...m, status: 'done' as const }));
                    return [
                        ...updated,
                        { id: `think-${idx}`, text: msg.text, status: 'typing' as const },
                    ];
                });
            }, msg.delay);
            timers.push(timer);
        });

        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    // When build completes, mark all thinking messages as done
    useEffect(() => {
        if (isComplete) {
            setThinkingMessages(prev =>
                prev.map(m => ({ ...m, status: 'done' as const }))
            );
            // Collapse thinking after a short delay
            setTimeout(() => setShowThinkingDetail(false), 800);
        }
    }, [isComplete]);

    // Auto-scroll thinking stream
    useEffect(() => {
        if (thinkingScrollRef.current) {
            thinkingScrollRef.current.scrollTop = thinkingScrollRef.current.scrollHeight;
        }
    }, [thinkingMessages]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Simulate step progression
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

    // Handle chat submit
    const handleChatSubmit = () => {
        const trimmed = chatInput.trim();
        if (!trimmed) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: trimmed,
        };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput("");

        // Notify parent
        onChatSubmit?.(trimmed);

        // Simulate AI acknowledgment after a short delay
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'ai',
                text: `Got it! I'll ${trimmed.toLowerCase().startsWith('add') || trimmed.toLowerCase().startsWith('make') || trimmed.toLowerCase().startsWith('change')
                    ? trimmed.toLowerCase()
                    : `work on: "${trimmed}"`
                    }. Applying changes...`,
            };
            setChatMessages(prev => [...prev, aiMsg]);
        }, 1200);
    };

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-4">
            {/* Left Panel: Thinking Stream + Chat */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/3 flex flex-col gap-3 h-full min-h-0"
            >
                {/* Steps Card */}
                <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-accent/10 rounded-md">
                            <Laptop className="w-4 h-4 text-accent" />
                        </div>
                        <h3 className="font-semibold text-sm">Builder Agent</h3>
                    </div>

                    <div className="space-y-2.5">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    {step.status === 'completed' && (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    )}
                                    {step.status === 'running' && (
                                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                                    )}
                                    {step.status === 'pending' && (
                                        <Circle className="w-4 h-4 text-muted-foreground/30" />
                                    )}
                                    {idx < steps.length - 1 && (
                                        <div className={`absolute top-4 w-px h-2.5 ${step.status === 'completed' ? 'bg-green-500/50' : 'bg-muted-foreground/20'}`} />
                                    )}
                                </div>
                                <span className={`text-xs ${step.status === 'running' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Thinking Stream */}
                <div className="flex-1 min-h-0 bg-card border border-card-border rounded-xl overflow-hidden flex flex-col shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border bg-card/80 shrink-0">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-medium text-foreground">
                                {isComplete ? 'Build Complete' : 'AI Thinking'}
                            </span>
                            {!isComplete && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            )}
                        </div>
                        {isComplete && (
                            <button
                                onClick={() => setShowThinkingDetail(!showThinkingDetail)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                {showThinkingDetail ? 'Collapse' : 'Expand'}
                                <ChevronDown className={`w-3 h-3 transition-transform ${showThinkingDetail ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>

                    {/* Thinking Content */}
                    <AnimatePresence mode="wait">
                        {isComplete && !showThinkingDetail ? (
                            /* Build Summary (collapsed) */
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 py-3 shrink-0"
                            >
                                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-green-500/8 border border-green-500/15">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-green-400">Build completed successfully</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {thinkingMessages.length} steps processed • Ready for refinements
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Thinking Messages (expanded) */
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                ref={thinkingScrollRef}
                                className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0"
                            >
                                {thinkingMessages.length === 0 && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span className="text-xs">Initializing...</span>
                                    </div>
                                )}

                                {thinkingMessages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-start gap-2"
                                    >
                                        {msg.status === 'done' ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500/70 mt-0.5 shrink-0" />
                                        ) : (
                                            <Loader2 className="w-3.5 h-3.5 text-accent animate-spin mt-0.5 shrink-0" />
                                        )}
                                        <span className={`text-xs leading-relaxed ${msg.status === 'typing' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {msg.text}
                                            {msg.status === 'typing' && (
                                                <span className="thinking-cursor" />
                                            )}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Chat Box */}
                <div className="bg-card border border-card-border rounded-xl overflow-hidden flex flex-col shadow-sm shrink-0" style={{ maxHeight: '40%', minHeight: '160px' }}>
                    {/* Chat Header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border bg-card/80 shrink-0">
                        <Bot className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-medium text-foreground">Chat</span>
                        {chatMessages.length > 0 && (
                            <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                                {chatMessages.length}
                            </span>
                        )}
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatScrollRef}
                        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0"
                    >
                        {chatMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4">
                                <Bot className="w-6 h-6 text-muted-foreground/30 mb-2" />
                                <p className="text-[11px] text-muted-foreground/50">
                                    {isComplete
                                        ? "Send a message to refine your app"
                                        : "Chat available after build completes"
                                    }
                                </p>
                            </div>
                        )}

                        {chatMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${msg.role === 'user'
                                        ? 'chat-bubble-user'
                                        : 'chat-bubble-ai'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="px-3 py-2.5 border-t border-card-border bg-card/50 shrink-0">
                        <div className={`flex items-center gap-2 rounded-lg bg-input-bg border transition-colors px-3 py-2 ${!isComplete ? 'border-input-border opacity-60' : 'border-input-border focus-within:border-accent/40'}`}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && isComplete && handleChatSubmit()}
                                disabled={!isComplete}
                                placeholder={isComplete ? "Refine your app..." : "Wait for build to complete..."}
                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-xs disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={handleChatSubmit}
                                disabled={!isComplete || !chatInput.trim()}
                                className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                            >
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
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
