"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { PricingCard } from "../../components/PricingCard";
import { FAQ } from "../../components/FAQ";
import { pricingPlans, faqData } from "../../lib/data";

export default function PricingPage() {
    const [annual, setAnnual] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            {/* Nav */}
            <nav className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Divergent</span>
                </Link>
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Dashboard
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Transparent pricing for every builder
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Choose the plan that fits your ambitions. From side projects to enterprise.
                    </p>
                </motion.div>

                {/* Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-center gap-3 mb-10"
                >
                    <span className={`text-xs font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setAnnual(!annual)}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${annual ? "bg-accent" : "bg-white/[0.08]"
                            }`}
                    >
                        <motion.span
                            animate={{ x: annual ? 22 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white"
                        />
                    </button>
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${annual ? "text-foreground" : "text-muted-foreground"}`}>
                        Annual
                        {annual && (
                            <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-md font-semibold">
                                -17%
                            </span>
                        )}
                    </span>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
                    {pricingPlans.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} annual={annual} index={i} />
                    ))}
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-foreground text-center mb-6">
                        Frequently Asked Questions
                    </h2>
                    <FAQ items={faqData} />
                </div>

                {/* Footer */}
                <div className="text-center mt-16 pt-6 border-t border-card-border">
                    <p className="text-xs text-muted-foreground">© 2026 Divergent</p>
                </div>
            </div>
        </div>
    );
}
