"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { PricingPlan } from "@/lib/data";

interface PricingCardProps {
    plan: PricingPlan;
    annual: boolean;
    index: number;
}

export function PricingCard({ plan, annual, index }: PricingCardProps) {
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    const saved = plan.monthlyPrice > 0 ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative rounded-xl p-5 flex flex-col ${plan.popular
                    ? "bg-card border-2 border-accent/40"
                    : "bg-card border border-card-border"
                }`}
        >
            {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-md bg-accent text-white text-[10px] font-semibold">
                    Popular
                </div>
            )}

            <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground mb-0.5">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-5">
                <div className="flex items-end gap-0.5">
                    <span className="text-3xl font-bold text-foreground">${price}</span>
                    <span className="text-xs text-muted-foreground mb-1">/ mo</span>
                </div>
                {annual && saved > 0 && (
                    <p className="text-xs text-green-400 mt-1">Save ${saved}/yr</p>
                )}
            </div>

            <ul className="flex-1 space-y-2.5 mb-5">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                        <span className="text-muted">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${plan.popular
                        ? "bg-accent text-white hover:bg-accent-hover"
                        : "bg-white/[0.06] text-foreground hover:bg-white/[0.1] border border-card-border"
                    }`}
            >
                {plan.cta}
            </button>
        </motion.div>
    );
}
