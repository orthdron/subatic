import { db } from "@/database/db";
import { sql } from "kysely";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Video retention, run by the transcoder's `python -m src.retention` (on a cron):
 * it asks GET /api/video/expired which videos are past the policy, deletes their
 * files from both buckets, then calls POST /api/video/delete for each one.
 *
 * The policy travels with every call so it lives in one place (the cron line).
 * At least one user must be kept, so a malformed call can't wipe every video.
 */
export const retentionPolicy = z.object({
    olderThanDays: z.coerce.number().int().min(0).max(36_500),
    keepUsers: z.array(z.string().trim().min(1)).min(1),
});

export type RetentionPolicy = z.infer<typeof retentionPolicy>;

/** Same shared secret the transcoder uses for its status updates. */
export function rejectUnlessWebhookToken(req: NextRequest): NextResponse | null {
    if (!process.env.WEBHOOK_TOKEN) {
        console.error("WEBHOOK_TOKEN is not set in environment variables.");
        return NextResponse.json({ error: "Server configuration error. Missing WEBHOOK_TOKEN" }, { status: 500 });
    }
    if (req.headers.get("X-Webhook-Token") !== process.env.WEBHOOK_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

function expiredVideos({ olderThanDays, keepUsers }: RetentionPolicy) {
    return db
        .selectFrom("video")
        .innerJoin("user", "user.id", "video.userId")
        .where("user.userName", "not in", keepUsers)
        // created_at is set by the database's now(), so compare against it there too.
        .where("video.createdAt", "<", sql<Date>`now() - make_interval(days => ${olderThanDays})`);
}

/** Ids of every video past the policy, in any status, oldest first. */
export async function listExpiredVideoIds(policy: RetentionPolicy): Promise<string[]> {
    const rows = await expiredVideos(policy).select("video.id").orderBy("video.createdAt").execute();
    return rows.map((row) => row.id);
}

/** Deletes the row only if the video is still past the policy. Returns whether it did. */
export async function deleteExpiredVideo(id: string, policy: RetentionPolicy): Promise<boolean> {
    const eligible = expiredVideos(policy).select("video.id").where("video.id", "=", id);
    const result = await db.deleteFrom("video").where("id", "in", eligible).executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
}
