"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    index: number;
}

export function StatsCard({ label, value, icon: Icon, trend, index }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="rounded-xl bg-card border border-card-border p-5 relative overflow-hidden group"
        >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-purple-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                        {trend}
                    </span>
                )}
            </div>

            <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-sm text-muted">{label}</p>
        </motion.div>
    );
}
