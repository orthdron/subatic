import VideoPlayer from "@/components/video/VideoPlayer";
import { videoMedia } from "@/lib/media";
import { getVideoWithAuthor } from "@/lib/videos";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { id } = await props.params;
    const video = await getVideoWithAuthor(id);
    // Don't reveal titles of videos that aren't published yet.
    if (!video || video.status !== "DONE") return { title: "Video unavailable" };
    return {
        title: video.title,
        description: video.description,
    };
}

export default async function EmbedPage(props: Props) {
    const { id } = await props.params;
    const video = await getVideoWithAuthor(id);

    // Inside an iframe a redirect would load the whole site, so explain instead.
    if (!video || video.status !== "DONE") {
        return (
            <div className="p-6 text-center">
                <p className="font-medium text-screen">This video isn&apos;t available</p>
                <p className="mt-1 text-sm text-usher">
                    {video ? "It's still being processed. Try again in a few minutes." : "It may have been removed."}
                </p>
            </div>
        );
    }

    const media = videoMedia(id);

    return (
        <VideoPlayer
            title={video.title}
            stream={media.stream}
            poster={media.poster}
            thumbnailTrack={media.thumbnailTrack}
            className="w-full max-w-[calc(100dvh*16/9)]"
        />
    );
}
