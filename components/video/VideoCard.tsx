"use client";

import Link from "next/link";
import { useState } from "react";

export interface VideoCardProps {
    id: string;
    title: string;
    author: string;
    /** Pre-formatted on the server, e.g. "3 days ago", to avoid hydration drift. */
    publishedLabel: string;
    publishedIso: string;
    duration: string | null;
    preview: { still: string; short: string; long: string };
    /** Load immediately instead of lazily (for cards above the fold). */
    eager?: boolean;
}

/**
 * Public grid tile. The slow "short" GIF loops at rest; hovering or focusing
 * the card swaps in the faster "long" preview. With reduced motion the
 * still poster is shown instead.
 */
export default function VideoCard({ id, title, author, publishedLabel, publishedIso, duration, preview, eager }: VideoCardProps) {
    const [isPreviewing, setIsPreviewing] = useState(false);

    return (
        <article className="group min-w-0">
            <Link
                href={`/video/${id}`}
                className="block rounded-md focus-visible:outline-offset-4"
                onMouseEnter={() => setIsPreviewing(true)}
                onMouseLeave={() => setIsPreviewing(false)}
                onFocus={() => setIsPreviewing(true)}
                onBlur={() => setIsPreviewing(false)}
            >
                <div className="relative aspect-video overflow-hidden rounded-md bg-stage ring-1 ring-white/5 transition-[box-shadow] group-hover:ring-white/20">
                    <picture>
                        <source media="(prefers-reduced-motion: reduce)" srcSet={preview.still} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={isPreviewing ? preview.long : preview.short}
                            alt=""
                            loading={eager ? "eager" : "lazy"}
                            decoding="async"
                            className="size-full object-cover"
                        />
                    </picture>
                    {duration && (
                        <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-black/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
                            {duration}
                        </span>
                    )}
                </div>
                <h2 className="mt-3 line-clamp-2 text-[15px] font-medium leading-snug text-screen">{title}</h2>
            </Link>
            <p className="mt-1 flex justify-between gap-3 text-[13px] text-usher">
                <span className="truncate">{author}</span>
                <time dateTime={publishedIso} className="shrink-0">
                    {publishedLabel}
                </time>
            </p>
        </article>
    );
}
