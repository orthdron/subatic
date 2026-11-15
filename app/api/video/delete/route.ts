import { authorizeRetention, deleteExpiredVideo } from "@/lib/retention";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({ id: z.string().min(1) });

/**
 * POST { id } -> { deleted }. Called after the video's files are gone.
 * Only deletes a video that is past the configured policy, i.e. one
 * GET /api/video/expired would list. 404 while retention is off.
 */
export async function POST(req: NextRequest) {
    const policy = authorizeRetention(req);
    if (policy instanceof NextResponse) return policy;

    const body = requestSchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        return NextResponse.json({ error: "Invalid input", details: body.error.issues }, { status: 400 });
    }

    try {
        return NextResponse.json({ deleted: await deleteExpiredVideo(body.data.id, policy) });
    } catch (error) {
        console.error("Error deleting expired video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
