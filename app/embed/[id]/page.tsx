import VideoPlayer from "@/components/video/VideoPlayer";
import { db } from "@/database/db";
import { redirect } from "next/navigation";

async function fetchVideoData(id: string) {
    return await db.selectFrom('video')
        .innerJoin('user', 'user.id', 'video.userId')
        .select(['video.id', 'video.title', 'video.description', 'user.userName'])
        .where('video.id', '=', id)
        .limit(1)
        .executeTakeFirst();
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const video = await fetchVideoData(id);

    return {
        title: `Subatic - ${video?.title}`,
        description: `${video?.description}`,
    };
}

export default async function Page(props0: { params: Promise<{ id: string }> }) {
    const params = await props0.params;
    const { id } = params;
    const video = await fetchVideoData(id);

    if (!video) {
        redirect('/');
    }

    const publicUrl = process.env.PROCESSED_VIDEO_URL!.replace(/\/+$/, '');
    if (!publicUrl) {
        throw new Error("PROCESSED_VIDEO_URL is not defined");
    }

    const videoProps = {
        url: `${publicUrl}/${id}/master.m3u8`,
        vtt: `${publicUrl}/${id}/sprite.vtt`,
        poster: `${publicUrl}/${id}/poster.jpg`,
        ...video
    };

    return (
        <VideoPlayer props={videoProps} />
    );
}
