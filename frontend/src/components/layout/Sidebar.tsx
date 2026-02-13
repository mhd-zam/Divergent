"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FolderOpen,
    Settings,
    Plus,
    User,
} from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/projects", icon: FolderOpen, label: "Projects" },
    { href: "/new-project", icon: Plus, label: "New" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 h-screen w-[64px] bg-sidebar-bg border-r border-sidebar-border flex flex-col items-center z-50">
            {/* Logo */}
            <div className="w-full flex justify-center py-5">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                </div>
            </div>

            {/* Nav Icons */}
            <nav className="flex-1 flex flex-col items-center gap-1 pt-2">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group relative
                ${isActive
                                    ? "bg-white/[0.1] text-white"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                                }
              `}
                        >
                            <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />

                            {/* Tooltip */}
                            <span className="absolute left-full ml-3 px-2.5 py-1 bg-card border border-card-border rounded-lg text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Avatar */}
            <div className="pb-5">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.1] transition-all"
                >
                    <User className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </Link>
            </div>
        </aside>
    );
}
