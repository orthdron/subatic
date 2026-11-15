import { Pagination } from "@/components/ui/pagination";
import VideoCard from "@/components/video/VideoCard";
import { formatDuration, formatRelativeDate } from "@/lib/format";
import { videoMedia } from "@/lib/media";
import type { PublishedVideo } from "@/lib/videos";

/** The first row at the widest layout is above the fold, so skip lazy loading there. */
const EAGER_CARDS = 4;

/** Grid of published videos with a pager underneath. */
export default function VideoGrid({
    videos,
    currentPage,
    totalPages,
    hrefForPage,
}: {
    videos: PublishedVideo[];
    currentPage: number;
    totalPages: number;
    hrefForPage: (page: number) => string;
}) {
    const now = new Date();

    return (
        <>
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((video, index) => {
                    const media = videoMedia(video.id);
                    return (
                        <VideoCard
                            key={video.id}
                            id={video.id}
                            title={video.title}
                            author={video.userName}
                            publishedLabel={formatRelativeDate(video.createdAt, now)}
                            publishedIso={video.createdAt.toISOString()}
                            duration={formatDuration(video.duration)}
                            preview={{
                                still: media.poster,
                                short: media.previewShort,
                                long: media.previewLong,
                                legacyShort: media.legacyPreviewShort,
                                legacyLong: media.legacyPreviewLong,
                            }}
                            eager={index < EAGER_CARDS}
                        />
                    );
                })}
            </div>
            <Pagination className="mt-12" currentPage={currentPage} totalPages={totalPages} hrefForPage={hrefForPage} />
        </>
    );
}
