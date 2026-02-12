export type ProjectStatus = "deployed" | "developing" | "draft";

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    lastEdited: string;
    gradient: number;
    deployedUrl?: string;
    framework: string;
}

export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    plan: "free" | "standard" | "pro";
    credits: number;
    maxCredits: number;
}

export interface PricingPlan {
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    popular?: boolean;
    cta: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export const mockUser: UserProfile = {
    name: "Alex Chen",
    email: "alex@divergent.dev",
    avatar: "AC",
    plan: "pro",
    credits: 623,
    maxCredits: 750,
};

export const mockProjects: Project[] = [
    {
        id: "proj-1",
        name: "Customer Support Bot",
        description: "AI-powered customer support chatbot with multi-language support",
        status: "deployed",
        lastEdited: "5 mins ago",
        gradient: 1,
        deployedUrl: "https://support-bot.divergent.app",
        framework: "Next.js",
    },
    {
        id: "proj-2",
        name: "Sales Outreach AI",
        description: "Automated sales outreach with personalized email generation",
        status: "developing",
        lastEdited: "2 hours ago",
        gradient: 2,
        framework: "React",
    },
    {
        id: "proj-3",
        name: "Content Generator",
        description: "Blog post and social media content generator",
        status: "draft",
        lastEdited: "1 day ago",
        gradient: 3,
        framework: "Vue.js",
    },
    {
        id: "proj-4",
        name: "Data Analysis Tool",
        description: "Interactive data visualization and analysis dashboard",
        status: "deployed",
        lastEdited: "1 hour ago",
        gradient: 4,
        deployedUrl: "https://data-tool.divergent.app",
        framework: "Next.js",
    },
    {
        id: "proj-5",
        name: "Code Assistant",
        description: "AI pair programming assistant with code review capabilities",
        status: "developing",
        lastEdited: "30 mins ago",
        gradient: 5,
        framework: "React",
    },
    {
        id: "proj-6",
        name: "Language Translator",
        description: "Real-time translation app with 50+ language support",
        status: "deployed",
        lastEdited: "2 days ago",
        gradient: 6,
        deployedUrl: "https://translator.divergent.app",
        framework: "Next.js",
    },
    {
        id: "proj-7",
        name: "E-commerce Builder",
        description: "No-code e-commerce platform with AI product descriptions",
        status: "developing",
        lastEdited: "4 hours ago",
        gradient: 7,
        framework: "Next.js",
    },
    {
        id: "proj-8",
        name: "Portfolio Maker",
        description: "Personal portfolio website builder with AI-generated content",
        status: "draft",
        lastEdited: "3 days ago",
        gradient: 8,
        framework: "Astro",
    },
];

export const pricingPlans: PricingPlan[] = [
    {
        name: "Free",
        description: "Get started with essential features at no cost",
        monthlyPrice: 0,
        annualPrice: 0,
        features: [
            "10 free monthly credits",
            "Unlock all core platform features",
            "Build elegant Web experiences",
            "Instant access to advanced models",
            "One-click LLM integration",
        ],
        cta: "Get Started",
    },
    {
        name: "Standard",
        description: "Perfect for first-time builders",
        monthlyPrice: 20,
        annualPrice: 17,
        features: [
            "Everything in Free, plus:",
            "Build web & mobile apps",
            "Private project hosting",
            "100 credits per month",
            "Purchase extra credits as needed",
            "GitHub integration",
            "Fork tasks",
        ],
        cta: "Get Started",
    },
    {
        name: "Pro",
        description: "Built for serious creators and brands",
        monthlyPrice: 200,
        annualPrice: 167,
        popular: true,
        features: [
            "Everything in Standard, plus:",
            "1M context window",
            "Ultra thinking",
            "System Prompt Edit",
            "Create custom AI agents",
            "High-performance computing",
            "750 Monthly Credits",
            "Priority customer support",
        ],
        cta: "Get Started",
    },
];

export const faqData: FAQItem[] = [
    {
        question: "What is Divergent and how does it work?",
        answer:
            "Divergent is an AI-powered development platform that transforms your ideas into fully functional applications. Simply describe what you want to build in natural language, and our AI handles the coding, design, and deployment. No programming experience required.",
    },
    {
        question: "What can I build with Divergent?",
        answer:
            "You can build a wide range of applications including web apps, mobile apps, chatbots, APIs, dashboards, e-commerce stores, portfolio sites, and more. Our AI supports multiple frameworks including React, Next.js, Vue, and others.",
    },
    {
        question: "How does Divergent's pricing work?",
        answer:
            "Divergent uses a credit-based system. Every action uses credits. Free users get 10 monthly credits, Standard users get 100, and Pro users get 750. You can also purchase additional credits as needed with any paid plan.",
    },
    {
        question: "Do I need coding experience to use Divergent?",
        answer:
            "Not at all! Divergent is designed for everyone — from complete beginners to experienced developers. Just describe what you want in plain English, and our AI handles the rest. Developers can also dive into the code for customization.",
    },
    {
        question: "How is Divergent different from other no-code platforms?",
        answer:
            "Unlike traditional no-code platforms, Divergent generates real, production-ready code that you own. You get full access to the source code, can deploy anywhere, and aren't locked into our platform. Plus, our AI can handle complex full-stack applications that other tools can't.",
    },
    {
        question: "What happens to the code Divergent creates?",
        answer:
            "You own 100% of the code. You can export it, deploy it to your own servers, push it to GitHub, or continue developing it in your preferred IDE. There's no vendor lock-in.",
    },
];

export const suggestedPrompts = [
    "Build me a SaaS dashboard with auth and billing",
    "Create a real-time chat application with rooms",
    "Design a portfolio website with blog and CMS",
    "Make an AI-powered document scanner app",
    "Build a project management tool like Trello",
    "Create an e-commerce store with Stripe payments",
];

export const chatMessages = [
    {
        id: "msg-1",
        role: "user" as const,
        content: "Build me a modern SaaS landing page with pricing and auth",
        timestamp: "2:30 PM",
    },
    {
        id: "msg-2",
        role: "assistant" as const,
        content:
            "I'll create a stunning SaaS landing page for you! Here's my plan:\n\n1. **Hero section** with animated gradient background\n2. **Features grid** with icons and descriptions\n3. **Pricing table** with 3 tiers\n4. **Auth system** with Google SSO and email/password\n5. **Responsive design** optimized for all devices\n\nLet me start building this now...",
        timestamp: "2:30 PM",
    },
    {
        id: "msg-3",
        role: "assistant" as const,
        content:
            "✅ Project structure created\n✅ Landing page with hero section\n✅ Pricing component with monthly/annual toggle\n✅ Authentication flows set up\n✅ Deployed to https://saas-landing.divergent.app\n\nYour app is live! Would you like to make any changes?",
        timestamp: "2:32 PM",
    },
];
