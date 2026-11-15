import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import ShareVideo from "@/components/video/ShareVideo";
import VideoGrid from "@/components/video/VideoGrid";
import VideoPlayer from "@/components/video/VideoPlayer";
import { formatDate, formatRelativeDate, isoDuration } from "@/lib/format";
import { videoMedia } from "@/lib/media";
import { requestOrigin } from "@/lib/site-url";
import { getVideoWithAuthor, listMoreVideos, type PublishedVideo } from "@/lib/videos";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoObject, WithContext } from "schema-dts";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { id } = await props.params;
    const video = await getVideoWithAuthor(id);
    // Don't reveal titles of videos that aren't published yet.
    if (!video || video.status === "FAILED") return { title: "Video not found" };
    if (video.status !== "DONE") return { title: "Video not ready yet" };
    return {
        title: video.title,
        description: video.description || `Watch ${video.title} on Subatic`,
    };
}

export default async function WatchPage(props: Props) {
    const { id } = await props.params;
    const video = await getVideoWithAuthor(id);

    // To visitors a video that failed to transcode doesn't exist.
    if (!video || video.status === "FAILED") {
        notFound();
    }
    if (video.status !== "DONE") {
        return (
            <PageContainer>
                <EmptyState
                    title="This video isn't ready yet"
                    body="It's still being uploaded or processed. Check back in a few minutes."
                    action={
                        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                            Browse videos
                        </Link>
                    }
                />
            </PageContainer>
        );
    }

    const media = videoMedia(id);

    let moreVideos: PublishedVideo[] = [];
    try {
        moreVideos = await listMoreVideos(id);
    } catch (error) {
        // The video itself still plays; only the suggestions are missing.
        console.error("Error fetching more videos:", error);
    }

    const origin = await requestOrigin();
    const embedUrl = `${origin}/embed/${id}`;

    const schema: WithContext<VideoObject> = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title,
        description: video.description || video.title,
        thumbnailUrl: media.poster,
        uploadDate: video.createdAt.toISOString(),
        duration: isoDuration(video.duration),
        contentUrl: media.stream,
        embedUrl,
        publisher: {
            "@type": "Organization",
            name: "Subatic",
            logo: { "@type": "ImageObject", url: `${origin}/logo.svg` },
        },
    };

    const embedCode = `<iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

    return (
        <>
            {/* Escape "<" so user-supplied titles can't close the script tag */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
            />

            {/* Theater band: the player sits on black, edge to edge */}
            <div className="bg-black">
                <div className="mx-auto w-full max-w-[min(1600px,calc(75dvh*16/9))]">
                    <VideoPlayer
                        title={video.title}
                        stream={media.stream}
                        poster={media.poster}
                        thumbnailTrack={media.thumbnailTrack}
                    />
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
                <div className="min-w-0">
                    <h1 className="text-3xl font-semibold leading-[1.08] font-stretch-condensed tracking-tight [overflow-wrap:anywhere] sm:text-4xl">
                        {video.title}
                    </h1>
                    <p className="mt-3 text-usher">
                        <span className="font-medium text-screen">{video.userName}</span> uploaded this{" "}
                        <time dateTime={video.createdAt.toISOString()} title={formatDate(video.createdAt)}>
                            {formatRelativeDate(video.createdAt)}
                        </time>
                    </p>
                    {video.description && (
                        <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed text-screen/85 [overflow-wrap:anywhere]">
                            {video.description}
                        </p>
                    )}
                </div>
                <aside>
                    <ShareVideo pageUrl={`${origin}/video/${id}`} embedCode={embedCode} />
                </aside>
            </div>

            {moreVideos.length > 0 && (
                <section aria-labelledby="more-videos" className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 lg:px-8">
                    <h2 id="more-videos" className="mb-6 text-2xl font-semibold font-stretch-condensed tracking-tight">
                        More videos
                    </h2>
                    <VideoGrid videos={moreVideos} eagerCount={0} />
                </section>
            )}
        </>
    );
}
