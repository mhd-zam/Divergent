"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, ExternalLink, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Project } from "../lib/data";

interface ProjectCardProps {
    project: Project;
    index: number;
}

const gradients = [
    "from-violet-600 via-purple-500 to-fuchsia-500",
    "from-blue-600 via-cyan-500 to-teal-400",
    "from-orange-500 via-amber-500 to-yellow-400",
    "from-rose-500 via-pink-500 to-purple-500",
    "from-emerald-500 via-green-400 to-lime-400",
    "from-indigo-600 via-blue-500 to-sky-400",
];

const statusConfig = {
    deployed: { color: "bg-green-400", label: "Live", textColor: "text-green-400" },
    developing: { color: "bg-yellow-400", label: "Building", textColor: "text-yellow-400" },
    draft: { color: "bg-gray-400", label: "Draft", textColor: "text-gray-400" },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const gradient = gradients[(project.gradient - 1) % gradients.length];
    const status = statusConfig[project.status];

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="group rounded-xl bg-card border border-card-border overflow-hidden cursor-pointer hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
        >
            {/* Preview Area */}
            <div className={`h-40 relative bg-gradient-to-br ${gradient} overflow-hidden`}>
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:16px_16px]" />

                {/* Simulated UI wireframe */}
                <div className="absolute inset-3 rounded-lg bg-black/25 backdrop-blur-[2px] border border-white/[0.08] p-3 flex flex-col">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 mb-2.5">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="h-2 w-20 rounded bg-white/[0.1]" />
                        </div>
                    </div>

                    {/* Content wireframe */}
                    <div className="flex gap-2 flex-1">
                        {/* Sidebar */}
                        <div className="w-1/4 rounded-md bg-white/[0.05] p-1.5 space-y-1.5">
                            <div className="h-1.5 w-full rounded bg-white/[0.12]" />
                            <div className="h-1.5 w-3/4 rounded bg-white/[0.08]" />
                            <div className="h-1.5 w-full rounded bg-white/[0.06]" />
                            <div className="h-1.5 w-2/3 rounded bg-white/[0.08]" />
                        </div>
                        {/* Main area */}
                        <div className="flex-1 rounded-md bg-white/[0.04] p-2 space-y-2">
                            <div className="h-2 w-2/3 rounded bg-white/[0.12]" />
                            <div className="flex gap-1.5">
                                <div className="h-6 flex-1 rounded bg-white/[0.06]" />
                                <div className="h-6 flex-1 rounded bg-white/[0.06]" />
                            </div>
                            <div className="h-1.5 w-full rounded bg-white/[0.05]" />
                            <div className="h-1.5 w-4/5 rounded bg-white/[0.04]" />
                        </div>
                    </div>
                </div>

                {/* Hover overlay with open button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/10"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Open Project
                    </motion.div>
                </div>

                {/* Status + Menu */}
                <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm border border-white/[0.06]">
                        <div className={`w-1.5 h-1.5 rounded-full ${status.color} ${project.status === 'deployed' ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] text-white/80 font-medium">{status.label}</span>
                    </div>

                    <div ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="w-6 h-6 rounded-md bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/[0.06]"
                        >
                            <MoreHorizontal className="w-3 h-3" />
                        </button>

                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 mt-1 w-36 rounded-lg bg-card border border-card-border shadow-2xl overflow-hidden z-10"
                            >
                                {["Open", "Rename", "Duplicate", "Delete"].map((action) => (
                                    <button
                                        key={action}
                                        className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${action === "Delete"
                                            ? "text-red-400 hover:bg-red-400/10"
                                            : "text-muted hover:text-foreground hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3.5">
                <h3 className="font-semibold text-foreground text-[13px] truncate leading-tight">
                    {project.name}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    {project.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-card-border">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-white/[0.06] flex items-center justify-center">
                            <Globe className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">
                            {project.framework}
                        </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {project.lastEdited}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
