"use client";

import { motion } from "framer-motion";
import { ChatInput } from "../../components/ChatInput";
import { ProjectCard } from "../../components/ProjectCard";
import { mockProjects } from "../../lib/data";
import { Sparkles, Zap, Code2, Rocket, Clock } from "lucide-react";

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
    return (
        <div className="space-y-12">
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
                    <span className="bg-gradient-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                <ChatInput />

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
                        <span className="text-[11px] text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded-md">
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
        </div>
    );
}
