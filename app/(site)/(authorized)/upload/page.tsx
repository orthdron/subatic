import UploadVideoForm from "@/components/forms/UploadVideoForm";
import PageContainer from "@/components/layout/PageContainer";
import { validateRequest } from "@/lib/auth";
import { signInPath } from "@/lib/return-path";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Upload a video",
    description: "Upload a new video to Subatic",
};

export default async function UploadPage() {
    const { user } = await validateRequest();
    if (!user) {
        return redirect(signInPath("/upload"));
    }

    // MAX_FILE_SIZE is in megabytes.
    const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE) || 0;

    return (
        <PageContainer width="narrow" className="pt-12">
            <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">Upload a video</h1>
            <p className="mt-2 text-usher">
                After uploading, it&apos;s converted for streaming. It appears on the site once that&apos;s done.
            </p>
            <div className="mt-8">
                <UploadVideoForm maxFileSizeBytes={maxFileSizeMb * 1024 * 1024} />
            </div>
        </PageContainer>
    );
}
