import { db } from "@/database/db";
import { sql } from "kysely";

export const VIDEOS_PER_PAGE = 12;

/** Published (transcoded) videos, newest first, optionally filtered by title. */
export async function listPublishedVideos({ page, search }: { page: number; search?: string }) {
    let query = db
        .selectFrom("video")
        .innerJoin("user", "user.id", "video.userId")
        .where("video.status", "=", "DONE");

    if (search) {
        query = query.where(({ ref, val }) =>
            sql<boolean>`lower(trim(${ref("video.title")})) like lower(trim(${val(`%${search}%`)}))`
        );
    }

    const [videos, countRow] = await Promise.all([
        query
            .select(["video.id", "video.title", "video.duration", "video.createdAt", "user.userName"])
            .orderBy("video.createdAt", "desc")
            .limit(VIDEOS_PER_PAGE)
            .offset((page - 1) * VIDEOS_PER_PAGE)
            .execute(),
        query.select((eb) => eb.fn.countAll<string>().as("count")).executeTakeFirst(),
    ]);

    const total = Number(countRow?.count ?? 0);
    return { videos, total, totalPages: Math.ceil(total / VIDEOS_PER_PAGE) };
}

export type PublishedVideo = Awaited<ReturnType<typeof listPublishedVideos>>["videos"][number];

/** Other published videos for the watch page, picked at random so older ones get seen too. */
export async function listMoreVideos(excludeId: string, limit = 8): Promise<PublishedVideo[]> {
    return db
        .selectFrom("video")
        .innerJoin("user", "user.id", "video.userId")
        .where("video.status", "=", "DONE")
        .where("video.id", "!=", excludeId)
        .select(["video.id", "video.title", "video.duration", "video.createdAt", "user.userName"])
        .orderBy(sql`random()`)
        .limit(limit)
        .execute();
}

/** Every published video, newest first, for the sitemap. */
export async function listAllPublishedVideos() {
    return db
        .selectFrom("video")
        .select(["id", "title", "description", "duration", "createdAt"])
        .where("status", "=", "DONE")
        .orderBy("createdAt", "desc")
        .execute();
}

/** A single video with its uploader, used by the watch and embed pages. */
export async function getVideoWithAuthor(id: string) {
    return db
        .selectFrom("video")
        .innerJoin("user", "user.id", "video.userId")
        .select([
            "video.id",
            "video.title",
            "video.description",
            "video.status",
            "video.duration",
            "video.createdAt",
            "user.userName",
        ])
        .where("video.id", "=", id)
        .executeTakeFirst();
}

/** Every video a user has uploaded, in any status, newest first. */
export async function listUserVideos(userId: string) {
    return db
        .selectFrom("video")
        .selectAll()
        .where("userId", "=", userId)
        .orderBy("createdAt", "desc")
        .execute();
}

export async function getUserVideo(userId: string, id: string) {
    return db
        .selectFrom("video")
        .selectAll()
        .where("userId", "=", userId)
        .where("id", "=", id)
        .executeTakeFirst();
}

/** Turns the ?page= search param into a page number >= 1. */
export function parsePage(value: string | undefined): number {
    return Math.max(1, Math.floor(Number(value)) || 1);
}
