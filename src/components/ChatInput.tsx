"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, ArrowRight } from "lucide-react";

interface ChatInputProps {
    placeholder?: string;
    onSubmit?: (value: string) => void;
    variant?: "home" | "chat";
}

export function ChatInput({
    placeholder = "Describe your app...",
    onSubmit,
    variant = "home",
}: ChatInputProps) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);

    const handleSubmit = () => {
        if (value.trim() && onSubmit) {
            onSubmit(value.trim());
            setValue("");
        }
    };

    if (variant === "chat") {
        return (
            <div
                className={`flex items-center gap-3 rounded-xl bg-input-bg border-2 transition-all duration-200 px-4 py-3 ${focused ? "border-accent/40 shadow-[0_0_20px_rgba(99,102,241,0.06)]" : "border-input-border"
                    }`}
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Type your instructions..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!value.trim()}
                    className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Send className="w-3.5 h-3.5" />
                </motion.button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <div
                className={`rounded-2xl bg-card border-2 transition-all duration-300 ${focused
                        ? "border-accent/50 shadow-[0_0_40px_rgba(99,102,241,0.1),0_0_80px_rgba(99,102,241,0.04)]"
                        : "border-card-border shadow-lg shadow-black/10"
                    }`}
            >
                {/* Textarea */}
                <div className="px-5 pt-5 pb-2">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-[15px] resize-none leading-relaxed"
                    />
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between px-5 pb-4">
                    <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent/60" />
                        <span className="text-[11px] text-muted-foreground">AI-powered</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={!value.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                        Build
                        <ArrowRight className="w-3 h-3" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
