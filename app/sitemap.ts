import { videoMedia } from "@/lib/media";
import { requestOrigin } from "@/lib/site-url";
import { listAllPublishedVideos } from "@/lib/videos";
import type { MetadataRoute } from "next";

// Google's limit for <video:duration>, in seconds.
const MAX_VIDEO_DURATION = 28_800;

/** Next.js writes sitemap fields into the XML as-is, so user text must be escaped here. */
function xml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/** /sitemap.xml: the public pages plus every published video, with video details for search engines. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const origin = await requestOrigin();
    const videos = await listAllPublishedVideos();

    return [
        { url: `${origin}/`, lastModified: videos[0]?.createdAt, changeFrequency: "daily", priority: 1 },
        { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.3 },
        { url: `${origin}/story`, changeFrequency: "monthly", priority: 0.3 },
        ...videos.map((video) => ({
            url: `${origin}/video/${video.id}`,
            lastModified: video.createdAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
            videos: [
                {
                    title: xml(video.title),
                    // Required by Google; most uploads have none.
                    description: xml(video.description || video.title),
                    thumbnail_loc: videoMedia(video.id).poster,
                    player_loc: `${origin}/embed/${video.id}`,
                    duration: video.duration > 0 ? Math.min(video.duration, MAX_VIDEO_DURATION) : undefined,
                    // Next.js would print a Date with toString(); sitemaps need W3C (ISO 8601) dates.
                    publication_date: video.createdAt.toISOString(),
                },
            ],
        })),
    ];
}
