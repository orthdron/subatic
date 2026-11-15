import { buttonVariants } from "@/components/ui/button";
import StatusBadge from "@/components/video/StatusBadge";
import type { VideoStatus } from "@/database/kysely-types";
import { formatDate, formatDuration } from "@/lib/format";
import { Film, TriangleAlert } from "lucide-react";
import Link from "next/link";

interface ManagedVideo {
    id: string;
    title: string;
    createdAt: Date;
    duration: number;
    status: VideoStatus;
}

/** One row in "My videos": poster, title, status and actions. */
export default function ManagedVideoRow({ video, posterUrl }: { video: ManagedVideo; posterUrl: string }) {
    const isPublished = video.status === "DONE";
    const duration = formatDuration(video.duration);

    return (
        <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-stage ring-1 ring-white/5 sm:w-44">
                    {isPublished ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={posterUrl} alt="" loading="lazy" className="size-full object-cover" />
                    ) : (
                        <div className="grid size-full place-items-center text-usher/70">
                            {video.status === "FAILED" ? (
                                <TriangleAlert aria-hidden className="size-5" />
                            ) : (
                                <Film aria-hidden className="size-5" />
                            )}
                        </div>
                    )}
                    {duration && (
                        <span className="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 py-0.5 text-[11px] font-medium tabular-nums text-white">
                            {duration}
                        </span>
                    )}
                </div>
                <div className="min-w-0 space-y-1.5">
                    <h2 className="truncate font-medium text-screen">{video.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-usher">
                        <StatusBadge status={video.status} />
                        <span>
                            Uploaded <time dateTime={video.createdAt.toISOString()}>{formatDate(video.createdAt)}</time>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
                {isPublished && (
                    <Link href={`/video/${video.id}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                        Watch
                    </Link>
                )}
                <Link href={`/edit/${video.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Edit
                </Link>
            </div>
        </li>
    );
}
