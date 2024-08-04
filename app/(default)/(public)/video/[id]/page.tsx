import EmbedCodeSection from "@/components/video/EmbedCodeSection";
import VideoPlayer from "@/components/video/VideoPlayer";
import { db } from "@/database/db";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

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
        ...video
    };

    // Get the current domain
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Generate the embed code using the current domain
    const embedCode = `<iframe src="${protocol}://${domain}/embed/${id}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

    return (
        <div className="container mx-auto px-4 pt-4">
            <Toaster position="bottom-center" />
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <VideoPlayer props={videoProps} />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h2 className="text-2xl font-bold mb-2 text-white">{video.title}</h2>
                    <p className="text-gray-300">Uploaded by: {video.userName}</p>
                </div>
                <EmbedCodeSection embedCode={embedCode} />
            </div>
        </div>
    );
}