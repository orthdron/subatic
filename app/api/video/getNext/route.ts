import { db } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Get token from header
    const token = req.headers.get('X-Webhook-Token');

    if (!process.env.WEBHOOK_TOKEN) {
        console.error("WEBHOOK_TOKEN is not set in environment variables.");
        return NextResponse.json({ error: "Server configuration error. Missing WEBHOOK_TOKEN" }, { status: 500 });
    }

    if (token !== process.env.WEBHOOK_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // failAfter in minutes
    let failAfter = 600;
    if (process.env.MARK_FAILED_AFTER) {
        try {
            failAfter = parseInt(process.env.MARK_FAILED_AFTER);
            if (failAfter <= 0) throw new Error("MARK_FAILED_AFTER must be a positive number");
        } catch (error) {
            console.warn("Invalid value for MARK_FAILED_AFTER: " + process.env.MARK_FAILED_AFTER);
            console.warn("Using 600 minutes as default");
            failAfter = 600;
        }
    }

    // Update videos that should be retried due to timeout
    await db.updateTable('video')
        .set({
            status: 'UPLOADED'
        })
        .where('lastStatusUpdate', '<', new Date(Date.now() - failAfter * 60 * 1000))
        .where('status', '=', 'PROCESSING')
        .execute();

    let video: { id: string } | undefined;
    let updated = false;

    try {
        // Start a transaction
        await db.transaction().execute(async (trx) => {
            // Select the first video with status UPLOADED
            video = await trx.selectFrom('video')
                .select(['id'])
                .where('status', '=', 'UPLOADED')
                .limit(1)
                .executeTakeFirst();

            if (!video) {
                // If no video is found, return early
                return;
            }

            // Update the status of the selected video to PROCESSING
            const result = await trx.updateTable('video')
                .set({
                    status: 'PROCESSING',
                    lastStatusUpdate: new Date()
                })
                .where('id', '=', video.id)
                .where('status', '=', 'UPLOADED')
                .executeTakeFirst();

            // Check if any rows were affected
            updated = (result.numUpdatedRows ?? 0) > 0;

            // If no rows were updated, throw an error to rollback the transaction
            if (!updated) {
                throw new Error("Video transaction failed");
            }
        });

        if (!video) {
            return NextResponse.json({ message: "No video requires transcoding" });
        }

        return NextResponse.json({ id: video.id });
    } catch (error) {
        console.error("Transaction failed:", error);
        return NextResponse.json({ error: "Failed to process video" }, { status: 500 });
    }
}