"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Bell,
    Shield,
    Palette,
    CreditCard,
    Zap,
    Crown,
    ExternalLink,
} from "lucide-react";
import { mockUser } from "../../../lib/data";

const tabs = [
    { label: "Profile", icon: User },
    { label: "Preferences", icon: Palette },
    { label: "Plan & Billing", icon: CreditCard },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");

    return (
        <div className="space-y-6 max-w-2xl">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold text-foreground"
            >
                Settings
            </motion.h1>

            {/* Tabs */}
            <div className="flex gap-0.5 border-b border-card-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === tab.label
                            ? "text-foreground border-accent"
                            : "text-muted-foreground border-transparent hover:text-muted"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                {activeTab === "Profile" && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-card-border">
                            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                                {mockUser.avatar}
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground text-sm">{mockUser.name}</h3>
                                <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: "Full name", value: mockUser.name },
                                { label: "Email", value: mockUser.email },
                                { label: "Username", value: "@alexchen" },
                            ].map((field) => (
                                <div key={field.label}>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={field.value}
                                        className="w-full px-3 py-2 rounded-lg bg-input-bg border border-input-border text-foreground text-sm outline-none focus:border-white/[0.15] transition-colors"
                                    />
                                </div>
                            ))}
                            <button className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors cursor-pointer">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "Preferences" && (
                    <div className="space-y-2">
                        {[
                            { label: "Email notifications", desc: "Deployment and update alerts", icon: Bell, on: true },
                            { label: "Two-factor auth", desc: "Extra security layer", icon: Shield, on: false },
                            { label: "Dark mode", desc: "Interface theme", icon: Palette, on: true },
                        ].map((pref) => (
                            <div
                                key={pref.label}
                                className="flex items-center justify-between p-3.5 rounded-lg bg-card border border-card-border"
                            >
                                <div className="flex items-center gap-3">
                                    <pref.icon className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                                        <p className="text-xs text-muted-foreground">{pref.desc}</p>
                                    </div>
                                </div>
                                <button
                                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${pref.on ? "bg-accent" : "bg-white/[0.08]"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pref.on ? "translate-x-4" : ""
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "Plan & Billing" && (
                    <div className="space-y-5">
                        <div className="p-5 rounded-xl bg-card border border-card-border">
                            <div className="flex items-center gap-2 mb-3">
                                <Crown className="w-4 h-4 text-accent" />
                                <span className="text-sm font-semibold text-foreground">Pro Plan</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">All premium features enabled</p>

                            <div className="flex items-center gap-6 mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-foreground">$200</p>
                                    <p className="text-xs text-muted-foreground">per month</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Zap className="w-3.5 h-3.5 text-accent" />
                                        <span className="text-xs text-foreground font-medium">
                                            {mockUser.credits}/{mockUser.maxCredits}
                                        </span>
                                    </div>
                                    <div className="h-1 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-accent"
                                            style={{ width: `${(mockUser.credits / mockUser.maxCredits) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 transition-colors cursor-pointer">
                                Manage subscription <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-muted-foreground mb-2">History</h3>
                            <div className="space-y-1.5">
                                {[
                                    { date: "Feb 1, 2026", amount: "$200.00" },
                                    { date: "Jan 1, 2026", amount: "$200.00" },
                                    { date: "Dec 1, 2025", amount: "$200.00" },
                                ].map((bill, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-card border border-card-border"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{bill.amount}</p>
                                            <p className="text-xs text-muted-foreground">{bill.date}</p>
                                        </div>
                                        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">
                                            Paid
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
