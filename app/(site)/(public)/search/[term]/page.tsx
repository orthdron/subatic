import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import VideoGrid from "@/components/video/VideoGrid";
import { listPublishedVideos, parsePage } from "@/lib/videos";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
    params: Promise<{ term: string }>;
    searchParams: Promise<{ page?: string }>;
};

function decodeTerm(raw: string): string {
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const term = decodeTerm((await props.params).term);
    const page = parsePage((await props.searchParams).page);
    return {
        title: page > 1 ? `Search: ${term} (page ${page})` : `Search: ${term}`,
        description: `Videos matching ${term}`,
    };
}

export default async function SearchPage(props: Props) {
    const term = decodeTerm((await props.params).term);
    const currentPage = parsePage((await props.searchParams).page);

    let result;
    try {
        result = await listPublishedVideos({ page: currentPage, search: term });
    } catch (error) {
        console.error("Error searching videos:", error);
        return (
            <PageContainer>
                <EmptyState title="Search failed" body="The database didn't respond. Try the search again in a moment." />
            </PageContainer>
        );
    }

    const { videos, total, totalPages } = result;

    if (videos.length === 0) {
        return (
            <PageContainer>
                <EmptyState
                    title={<>No videos match &ldquo;{term}&rdquo;</>}
                    body="Check the spelling or try a shorter search."
                    action={
                        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                            Browse all videos
                        </Link>
                    }
                />
            </PageContainer>
        );
    }

    const basePath = `/search/${encodeURIComponent(term)}`;

    return (
        <PageContainer>
            <div className="mb-6 flex items-baseline justify-between gap-4">
                <h1 className="min-w-0 text-3xl font-semibold font-stretch-condensed tracking-tight [overflow-wrap:anywhere]">
                    Results for &ldquo;{term}&rdquo;
                </h1>
                <p className="shrink-0 text-sm tabular-nums text-usher">
                    {total} {total === 1 ? "video" : "videos"}
                </p>
            </div>
            <VideoGrid
                videos={videos}
                pagination={{
                    currentPage,
                    totalPages,
                    hrefForPage: (page) => (page === 1 ? basePath : `${basePath}?page=${page}`),
                }}
            />
        </PageContainer>
    );
}
