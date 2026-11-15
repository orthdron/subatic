import EditVideoForm from "@/components/forms/EditVideoForm";
import PageContainer from "@/components/layout/PageContainer";
import StatusBadge from "@/components/video/StatusBadge";
import { validateRequest } from "@/lib/auth";
import { signInPath } from "@/lib/return-path";
import { getUserVideo } from "@/lib/videos";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit video",
    description: "Edit your Subatic video",
};

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;

    const { user } = await validateRequest();
    if (!user) {
        return redirect(signInPath(`/edit/${encodeURIComponent(id)}`));
    }

    const video = await getUserVideo(user.id, id);
    if (!video) {
        return redirect("/");
    }

    const isPublished = video.status === "DONE";
    const isInProgress = video.status === "UPLOADED" || video.status === "PROCESSING" || video.status === "UPLOADING";

    return (
        <PageContainer width="narrow" className="pt-10">
            <Link
                href="/videos"
                className="-ml-1 inline-flex items-center gap-1 rounded-sm text-sm text-usher transition-colors hover:text-screen"
            >
                <ChevronLeft aria-hidden className="size-4" />
                My videos
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">Edit video</h1>
                <StatusBadge status={video.status} />
            </div>

            {isInProgress && (
                <p className="mt-3 text-usher">
                    The video is being processed. You can update the details while you wait.
                </p>
            )}
            {video.status === "FAILED" && (
                <p className="mt-3 text-usher">
                    Processing failed, so this video can&apos;t be watched. Try uploading the file again.
                </p>
            )}

            <div className="mt-8">
                <EditVideoForm video={{ id: video.id, title: video.title, description: video.description }} isPublished={isPublished} />
            </div>
        </PageContainer>
    );
}
