import VideoCard from "@/components/video/VideoCard";
import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: 'Subatic - Your video',
    description:
        'Manage your videos',
};

export default async function MyVideos() {
    const { user } = await validateRequest();
    if (!user) {
        redirect("/");
    }

    const videos = await db
        .selectFrom('video')
        .selectAll()
        .where('userId', '=', user.id)
        .execute();

    const publicUrl = process.env.NEXT_PUBLIC_FILE_URL;

    if (!publicUrl) {
        throw new Error("NEXT_PUBLIC_FILE_URL is not defined");
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold my-6">My Videos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} publicUrl={publicUrl} />
                ))}
            </div>
            <Toaster />
        </div>
    );
}