"use client";

import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-14 min-h-screen">
                {children}
            </main>
        </div>
    );
}
