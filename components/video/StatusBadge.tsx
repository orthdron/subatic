import type { VideoStatus } from "@/database/kysely-types";
import { cn } from "@/lib/utils";

const STATUS: Record<VideoStatus, { label: string; className: string }> = {
    DONE: { label: "Published", className: "bg-emerald-400/10 text-emerald-300" },
    UPLOADING: { label: "Uploading", className: "bg-sky-400/10 text-sky-300" },
    UPLOADED: { label: "Queued", className: "bg-amber-400/10 text-amber-200" },
    PROCESSING: { label: "Processing", className: "bg-amber-400/10 text-amber-200" },
    FAILED: { label: "Failed", className: "bg-red-500/15 text-red-300" },
};

export default function StatusBadge({ status, className }: { status: VideoStatus; className?: string }) {
    const { label, className: tone } = STATUS[status];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                tone,
                className
            )}
        >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

export function statusLabel(status: VideoStatus): string {
    return STATUS[status].label;
}
