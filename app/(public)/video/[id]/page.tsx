import VideoPlayer from "@/components/videoPlayer";
import { db } from "@/database/db";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;

    const video = await db.selectFrom('video')
        .innerJoin('user', 'user.id', 'video.userId')
        .select(['video.id', 'video.title', 'user.userName'])
        .where('video.id', '=', id)
        .limit(1)
        .executeTakeFirst();

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
        ...video
    };

    return (
        <div className="container mx-auto px-4 pt-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <VideoPlayer props={videoProps} />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2 text-white">{video.title}</h2>
                    <p className="text-gray-300">Uploaded by: {video.userName}</p>
                </div>
            </div>
        </div>
    );
}