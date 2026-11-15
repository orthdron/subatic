import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import ManagedVideoRow from "@/components/video/ManagedVideoRow";
import { validateRequest } from "@/lib/auth";
import { signInPath } from "@/lib/return-path";
import { videoMedia } from "@/lib/media";
import { listUserVideos } from "@/lib/videos";
import { Upload } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "My videos",
    description: "Manage your videos",
};

export default async function MyVideosPage() {
    const { user } = await validateRequest();
    if (!user) {
        redirect(signInPath("/videos"));
    }

    const videos = await listUserVideos(user.id);

    return (
        <PageContainer width="default" className="pt-10">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">My videos</h1>
                {videos.length > 0 && (
                    <Link href="/upload" className={buttonVariants()}>
                        <Upload aria-hidden />
                        Upload video
                    </Link>
                )}
            </div>

            {videos.length === 0 ? (
                <EmptyState
                    headingLevel="h2"
                    title="You haven't uploaded anything yet"
                    body="Upload a video and it'll be listed here while it's processed and after it's published."
                    action={
                        <Link href="/upload" className={buttonVariants()}>
                            <Upload aria-hidden />
                            Upload a video
                        </Link>
                    }
                />
            ) : (
                <ul className="mt-6 divide-y divide-rail border-y border-rail">
                    {videos.map((video) => (
                        <ManagedVideoRow key={video.id} video={video} posterUrl={videoMedia(video.id).poster} />
                    ))}
                </ul>
            )}
        </PageContainer>
    );
}
