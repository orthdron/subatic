import { db } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
    id: z.string(),
    status: z.enum(["DONE", "FAILED"]),
    token: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate the request body
        const result = requestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid input", details: result.error.issues }, { status: 400 });
        }

        const { id, status, token } = result.data;

        if (!process.env.WEBHOOK_TOKEN) {
            console.warn("WEBHOOK_TOKEN is not set in environment variables.");
            return NextResponse.json({ error: "Server configuration error. Missing WEBHOOK_TOKEN" }, { status: 500 });
        }

        if (token !== process.env.WEBHOOK_TOKEN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbResult = await db
            .updateTable('video')
            .set({ status })
            .where('id', '=', id)
            .executeTakeFirst();

        if (dbResult.numUpdatedRows > 0) {
            return NextResponse.json({ response: `Status updated for video id: ${id}` }, { status: 200 });
        } else {
            return NextResponse.json({ error: "No rows updated" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}