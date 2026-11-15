import { db } from "@/database/db";
import { sql } from "kysely";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Optional video retention, off unless both are set (subatic.com uses it for its demo):
 *
 *   VIDEO_RETENTION_DAYS=30             delete videos this many days after upload
 *   VIDEO_RETENTION_KEEP_USERS=admin    comma-separated users whose videos are kept
 *
 * The transcoder's `python -m src.retention`, run from a daily cron, asks
 * GET /api/video/expired which videos are past the policy, deletes their files
 * from both buckets, then calls POST /api/video/delete for each one. The
 * policy lives only here, so a caller can never widen it. While retention is
 * off both endpoints answer 404, as if they did not exist.
 */
const retentionPolicy = z.object({
    olderThanDays: z.coerce.number().int().min(1).max(36_500),
    keepUsers: z.array(z.string().min(1)).min(1),
});

export type RetentionPolicy = z.infer<typeof retentionPolicy>;

/** The configured policy, or null when retention is off (the default). */
export function retentionPolicyFromEnv(): RetentionPolicy | null {
    const days = process.env.VIDEO_RETENTION_DAYS;
    const keepUsers = process.env.VIDEO_RETENTION_KEEP_USERS;
    if (!days && !keepUsers) {
        return null;
    }
    const policy = retentionPolicy.safeParse({
        olderThanDays: days,
        keepUsers: (keepUsers ?? "").split(",").map((name) => name.trim()).filter(Boolean),
    });
    if (!policy.success) {
        console.error("VIDEO_RETENTION_DAYS / VIDEO_RETENTION_KEEP_USERS are invalid, so retention is off:", policy.error.issues);
        return null;
    }
    return policy.data;
}

/** Returns the policy, or the response to send: 404 while retention is off, 401 without the webhook token. */
export function authorizeRetention(req: NextRequest): RetentionPolicy | NextResponse {
    const policy = retentionPolicyFromEnv();
    if (!policy) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Same shared secret the transcoder uses for its status updates.
    if (!process.env.WEBHOOK_TOKEN || req.headers.get("X-Webhook-Token") !== process.env.WEBHOOK_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return policy;
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
