"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    FolderOpen,
    Settings,
    CreditCard,
    LogOut,
    ChevronDown,
    Sparkles,
    User,
    Zap,
    Crown,
} from "lucide-react";
import { mockUser } from "../../lib/data";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderOpen },
];

export function Navbar() {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-xl border-b border-card-border z-50">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">Divergent</span>
                    </Link>

                    <div className="flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                        ? "bg-white/[0.08] text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                                        }`}
                                >
                                    <link.icon className="w-3.5 h-3.5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Credits + Profile Dropdown */}
                <div className="flex items-center gap-3">
                    {/* Credits indicator */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-card-border">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-xs text-muted font-medium">
                            {mockUser.credits}
                        </span>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                                {mockUser.avatar}
                            </div>
                            <ChevronDown
                                className={`w-3 h-3 text-muted-foreground transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-card-border shadow-2xl overflow-hidden"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-card-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                                                {mockUser.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{mockUser.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plan & Credits */}
                                    <div className="px-4 py-3 border-b border-card-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Crown className="w-3.5 h-3.5 text-accent" />
                                                <span className="text-xs font-medium text-foreground">Pro Plan</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {mockUser.credits}/{mockUser.maxCredits} credits
                                            </span>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-accent transition-all"
                                                style={{ width: `${(mockUser.credits / mockUser.maxCredits) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1.5">
                                        {[
                                            { href: "/settings", icon: User, label: "Profile & Settings" },
                                            { href: "/pricing", icon: CreditCard, label: "Plan & Billing" },
                                        ].map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
                                            >
                                                <item.icon className="w-3.5 h-3.5" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-card-border py-1.5">
                                        <button className="flex items-center gap-2.5 px-4 py-2 w-full text-xs text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer">
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
}
