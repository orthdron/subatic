import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import VideoThumbnail from "@/components/video/VideoThumbnail";
import { db } from "@/database/db";
import { sql } from "kysely";

const VIDEOS_PER_PAGE = 8;
const MAX_VISIBLE_PAGES = 5;

type PageNumber = number | '...';


export async function generateMetadata(
    props: {
        params: Promise<{ term: string }>;
        searchParams: Promise<{ page: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    let page = '1';
    if (searchParams.page) {
        page = searchParams.page;
    }
    return {
        title: `Subatic - Search ${params.term} - Page ${page}`,
        description: `Searching for ${params.term} - Page ${page}`,
    };
}

export default async function Page(
    props: {
        params: Promise<{ term: string }>;
        searchParams: Promise<{ page: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { term } = params;
    const currentPage = Math.max(1, Number(searchParams.page) || 1);
    const offset = (currentPage - 1) * VIDEOS_PER_PAGE;

    try {
        const [videos, countResult] = await Promise.all([
            db.selectFrom("video")
                .where('status', '=', 'DONE')
                .where(({ ref, val }) =>
                    sql`lower(trim(${ref('title')})) like lower(trim(${val(`%${term}%`)}))`
                )
                .orderBy('createdAt', 'desc')
                .limit(VIDEOS_PER_PAGE)
                .offset(offset)
                .selectAll()
                .execute(),
            db.selectFrom("video")
                .where('status', '=', 'DONE')
                .where(({ ref, val }) =>
                    sql`lower(trim(${ref('title')})) like lower(trim(${val(`%${term}%`)}))`
                )
                .select(db.fn.count('id').as('count'))
                .executeTakeFirst() as Promise<{ count: number }>
        ]);

        const totalVideos = countResult?.count || 0;
        const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

        const pageNumbers = generatePageNumbers(currentPage, totalPages, MAX_VISIBLE_PAGES);

        const hasPreviousPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;

        return (
            <div className="p-4">
                {videos.length === 0 ? (
                    <p className="text-center text-4xl">No videos found for &quot;{term}&quot; 😢</p>
                ) : (
                    <>
                        <h1 className="text-2xl mb-4">Search results for &quot;{term}&quot;</h1>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {videos.map((video) => (
                                <VideoThumbnail key={video.id || video.title} video={video} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        {hasPreviousPage && (
                                            <PaginationItem>
                                                <PaginationPrevious href={`/search/${term}?page=${currentPage - 1}`} />
                                            </PaginationItem>
                                        )}
                                        {pageNumbers.map((pageNumber, index) => (
                                            <PaginationItem key={index}>
                                                {pageNumber === '...' ? (
                                                    <span className="px-3 py-2">...</span>
                                                ) : (
                                                    <PaginationLink
                                                        href={`/search/${term}?page=${pageNumber}`}
                                                        isActive={currentPage === pageNumber}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}
                                        {hasNextPage && (
                                            <PaginationItem>
                                                <PaginationNext href={`/search/${term}?page=${currentPage + 1}`} />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error searching videos:', error);
        return <p className="text-center text-4xl">Error searching videos. Please try again later.</p>;
    }
}

function generatePageNumbers(current: number, total: number, max: number): PageNumber[] {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(max / 2);
    let start = Math.max(current - half, 1);
    let end = Math.min(start + max - 1, total);

    if (end === total) {
        start = Math.max(end - max + 1, 1);
    }

    const pages: PageNumber[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (start > 1) {
        pages.unshift(1);
        if (start > 2) pages.splice(1, 0, '...');
    }

    if (end < total) {
        if (end < total - 1) pages.push('...');
        pages.push(total);
    }

    return pages;
}
