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

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params;
    const video = await fetchVideoData(id);

    return {
        title: `Subatic - ${video?.title}`,
        description: `${video?.description}`,
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const video = await fetchVideoData(id);

    if (!video) {
        redirect('/');
    }

    const publicUrl = process.env.NEXT_PUBLIC_FILE_URL;
    if (!publicUrl) {
        throw new Error("NEXT_PUBLIC_FILE_URL is not defined");
    }

    const videoProps = {
        url: `${publicUrl}${id}/master.m3u8`,
        vtt: `${publicUrl}${id}/sprite.vtt`,
        poster: `${publicUrl}${id}/poster.jpeg`,
        ...video
    };

    return (
        <VideoPlayer props={videoProps} />
    );
}
