"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface VideoCardPreview {
    still: string;
    /** Animated WebP slideshow that loops at rest. */
    short: string;
    /** Muted MP4 that plays over it on hover or focus. */
    long: string;
    /** Videos transcoded before the WebP/MP4 previews only have these GIFs. */
    legacyShort: string;
    legacyLong: string;
}

export interface VideoCardProps {
    id: string;
    title: string;
    author: string;
    /** Pre-formatted on the server, e.g. "3 days ago", to avoid hydration drift. */
    publishedLabel: string;
    publishedIso: string;
    duration: string | null;
    preview: VideoCardPreview;
    /** Load immediately instead of lazily (for cards above the fold). */
    eager?: boolean;
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Public grid tile. The slow "short" preview loops at rest; hovering or
 * focusing the card plays the faster "long" one over it. With reduced motion
 * the still poster is shown instead.
 */
export default function VideoCard({ id, title, author, publishedLabel, publishedIso, duration, preview, eager }: VideoCardProps) {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isLongPlaying, setIsLongPlaying] = useState(false);
    const [isLegacy, setIsLegacy] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // A load error before hydration never reaches onError, so look for one here.
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth === 0) {
            setIsLegacy(true);
        }
    }, []);

    const startPreview = () => {
        if (!prefersReducedMotion()) {
            setIsPreviewing(true);
        }
    };
    const stopPreview = () => {
        setIsPreviewing(false);
        setIsLongPlaying(false);
    };

    let imageSrc = preview.short;
    if (isLegacy) {
        imageSrc = isPreviewing ? preview.legacyLong : preview.legacyShort;
    }

    return (
        <article className="group min-w-0">
            <Link
                href={`/video/${id}`}
                className="block rounded-md focus-visible:outline-offset-4"
                onMouseEnter={startPreview}
                onMouseLeave={stopPreview}
                onFocus={startPreview}
                onBlur={stopPreview}
            >
                <div className="relative aspect-video overflow-hidden rounded-md bg-stage ring-1 ring-white/5 transition-[box-shadow] group-hover:ring-white/20">
                    <picture>
                        <source media="(prefers-reduced-motion: reduce)" srcSet={preview.still} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt=""
                            loading={eager ? "eager" : "lazy"}
                            decoding="async"
                            onError={() => setIsLegacy(true)}
                            className="size-full object-cover"
                        />
                    </picture>
                    {isPreviewing && !isLegacy && (
                        // Mounted only while previewing, so nothing downloads until then.
                        // Hidden until it plays, so the short preview shows while it loads.
                        <video
                            src={preview.long}
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-hidden="true"
                            onPlaying={() => setIsLongPlaying(true)}
                            onError={stopPreview}
                            className={`absolute inset-0 size-full object-cover ${isLongPlaying ? "" : "opacity-0"}`}
                        />
                    )}
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
