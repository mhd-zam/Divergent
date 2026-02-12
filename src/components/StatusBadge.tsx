import { CheckCircle2, Loader2, FileText } from "lucide-react";
import type { ProjectStatus } from "@/lib/data";

const statusConfig = {
    deployed: {
        label: "Deployed",
        icon: CheckCircle2,
        className: "bg-success/10 text-success border-success/20",
    },
    developing: {
        label: "Developing",
        icon: Loader2,
        className: "bg-warning/10 text-warning border-warning/20",
    },
    draft: {
        label: "Draft",
        icon: FileText,
        className: "bg-muted/10 text-muted border-muted/20",
    },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
        >
            <Icon
                className={`w-3 h-3 ${status === "developing" ? "animate-spin" : ""
                    }`}
            />
            {config.label}
        </span>
    );
}
