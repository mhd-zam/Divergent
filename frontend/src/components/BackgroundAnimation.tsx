"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSnippet = `import { useState } from 'react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const [data, setData] = useState(null);
  
  return (
    <div className="p-4 grid gap-4">
      <StatsCard value="1,234" label="Users" />
      <Chart data={data} />
    </div>
  );
}`;

const promptSnippet = `> Create a modern dashboard with dark mode and analytics charts...`;

export function BackgroundAnimation() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-background to-background" />

            {/* Grid */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Left Card: Prompting */}
            <motion.div
                className="absolute top-[20%] left-[5%] w-[300px] md:w-[400px] p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl"
                initial={{ opacity: 0, x: -50, rotateY: 15, rotateX: 5 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{ duration: 1, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                style={{ rotateY: 15, rotateX: 5, perspective: 1000 }}
            >
                <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="font-mono text-sm text-indigo-300">
                    <Typewriter text={promptSnippet} speed={50} delay={1000} />
                </div>
            </motion.div>

            {/* Right Card: Code Generation */}
            <motion.div
                className="absolute top-[30%] right-[5%] w-[350px] md:w-[450px] p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl"
                initial={{ opacity: 0, x: 50, rotateY: -15, rotateX: 5 }}
                animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
                transition={{ duration: 1, delay: 0.5, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
                style={{ rotateY: -15, rotateX: 5, perspective: 1000 }}
            >
                <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="font-mono text-xs text-emerald-400/80 leading-relaxed whitespace-pre">
                    <Typewriter text={codeSnippet} speed={10} delay={4000} infinite />
                </div>
            </motion.div>
        </div>
    );
}

// Simple typewriter component
function Typewriter({ text, speed = 30, delay = 0, infinite = false }: { text: string; speed?: number; delay?: number; infinite?: boolean }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let currentIndex = 0;

        const startTyping = () => {
            setDisplayedText("");
            currentIndex = 0;

            const typeChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                    timeout = setTimeout(typeChar, speed + Math.random() * 20);
                } else if (infinite) {
                    timeout = setTimeout(startTyping, 3000); // Wait then restart
                }
            };

            typeChar();
        };

        timeout = setTimeout(startTyping, delay);
        return () => clearTimeout(timeout);
    }, [text, speed, delay, infinite]);

    return (
        <span>
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-accent ml-1 align-middle"
            />
        </span>
    );
}


