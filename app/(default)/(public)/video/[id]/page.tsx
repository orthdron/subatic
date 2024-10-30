import EmbedCodeSection from "@/components/video/EmbedCodeSection";
import VideoPlayer from "@/components/video/VideoPlayer";
import { db } from "@/database/db";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { VideoObject } from 'schema-dts';

async function fetchVideoData(id: string) {
    return await db.selectFrom('video')
        .innerJoin('user', 'user.id', 'video.userId')
        .select(['video.id', 'video.title', 'video.description', 'user.userName', 'video.status', 'video.createdAt'])
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

    if (!video || video.status !== 'DONE') {
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

    // Get the current domain and protocol
    const headersList = await headers();
    const domain = headersList.get('host') || '';
    const protocol = headersList.get('X-Forwarded-Proto') || 'http';

    const schema: VideoObject = {
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: videoProps.poster,
        uploadDate: new Date(video.createdAt).toISOString(),
        contentUrl: videoProps.url,
        embedUrl: `${protocol}://${domain}/embed/${id}`,
        publisher: {
            "@type": "Organization",
            name: "Subatic",
            logo: {
                "@type": "ImageObject",
                url: `${protocol}://${domain}/logo.svg`
            }
        }
    }

    // Generate the embed code using the current domain
    const embedCode = `<iframe src="${protocol}://${domain}/embed/${id}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
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
        </>
    );
}
