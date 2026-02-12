"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, LayoutGrid, List } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects, type ProjectStatus } from "@/lib/data";

const filters: { label: string; value: ProjectStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Deployed", value: "deployed" },
    { label: "Developing", value: "developing" },
    { label: "Draft", value: "draft" },
];

export default function ProjectsPage() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<ProjectStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filtered = useMemo(() => {
        return mockProjects.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = activeFilter === "all" || p.status === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [search, activeFilter]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <h1 className="text-xl font-semibold text-foreground">Projects</h1>
            </motion.div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-input-bg border border-input-border text-foreground placeholder:text-muted-foreground text-xs outline-none focus:border-white/[0.15] transition-colors"
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setActiveFilter(f.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${activeFilter === f.value
                                    ? "bg-white/[0.1] text-foreground"
                                    : "text-muted-foreground hover:text-muted hover:bg-white/[0.04]"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-0.5 ml-auto">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "text-foreground bg-white/[0.08]" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "text-foreground bg-white/[0.08]" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Count */}
            <p className="text-xs text-muted-foreground">
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Grid / List */}
            {filtered.length > 0 ? (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-2"
                    }
                >
                    {filtered.map((project, index) =>
                        viewMode === "grid" ? (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ) : (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card border border-card-border hover:border-white/[0.12] transition-colors cursor-pointer"
                            >
                                <div className={`preview-${project.gradient} w-10 h-10 rounded-lg shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{project.lastEdited}</span>
                                <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${project.status === "deployed"
                                            ? "bg-green-500/10 text-green-400"
                                            : project.status === "developing"
                                                ? "bg-yellow-500/10 text-yellow-400"
                                                : "bg-white/[0.05] text-muted-foreground"
                                        }`}
                                >
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                            </motion.div>
                        )
                    )}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-sm text-muted-foreground">No projects found</p>
                </div>
            )}
        </div>
    );
}
