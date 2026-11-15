import { deleteExpiredVideo, rejectUnlessWebhookToken, retentionPolicy } from "@/lib/retention";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = retentionPolicy.extend({ id: z.string().min(1) });

/**
 * POST { id, olderThanDays, keepUsers } -> { deleted }
 * Called after the video's files are gone. The policy is checked again here,
 * so this can only ever delete a video that GET /api/video/expired would list.
 */
export async function POST(req: NextRequest) {
    const rejected = rejectUnlessWebhookToken(req);
    if (rejected) return rejected;

    const body = requestSchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        return NextResponse.json({ error: "Invalid input", details: body.error.issues }, { status: 400 });
    }

    const { id, ...policy } = body.data;
    try {
        return NextResponse.json({ deleted: await deleteExpiredVideo(id, policy) });
    } catch (error) {
        console.error("Error deleting expired video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
