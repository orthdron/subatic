import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import VideoGrid from "@/components/video/VideoGrid";
import { validateRequest } from "@/lib/auth";
import { listPublishedVideos, parsePage } from "@/lib/videos";
import { Upload } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: { absolute: "Subatic" },
    description: "Video hosting platform",
};

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const currentPage = parsePage(searchParams.page);

    let result;
    try {
        result = await listPublishedVideos({ page: currentPage });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return (
            <PageContainer>
                <EmptyState
                    title="Videos couldn't be loaded"
                    body="The database didn't respond. Refresh the page to try again."
                />
            </PageContainer>
        );
    }

    const { videos, total, totalPages } = result;

    if (videos.length === 0) {
        if (currentPage > 1) {
            return (
                <PageContainer>
                    <EmptyState
                        title="No videos on this page"
                        body={`There ${totalPages === 1 ? "is only 1 page" : `are only ${totalPages} pages`} of videos.`}
                        action={
                            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                                Go to the first page
                            </Link>
                        }
                    />
                </PageContainer>
            );
        }

        const { user } = await validateRequest();
        return (
            <PageContainer>
                <EmptyState
                    title="No videos yet"
                    body={
                        user
                            ? "Videos you upload show up here once they've been processed."
                            : "Videos show up here once someone uploads one."
                    }
                    action={
                        user && (
                            <Link href="/upload" className={buttonVariants()}>
                                <Upload aria-hidden />
                                Upload a video
                            </Link>
                        )
                    }
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="mb-6 flex items-baseline justify-between gap-4">
                <h1 className="text-3xl font-semibold font-stretch-condensed tracking-tight">Latest videos</h1>
                <p className="text-sm tabular-nums text-usher">
                    {total} {total === 1 ? "video" : "videos"}
                </p>
            </div>
            <VideoGrid
                videos={videos}
                pagination={{
                    currentPage,
                    totalPages,
                    hrefForPage: (page) => (page === 1 ? "/" : `/?page=${page}`),
                }}
            />
        </PageContainer>
    );
}
