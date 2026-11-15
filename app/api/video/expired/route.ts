import { authorizeRetention, listExpiredVideoIds } from "@/lib/retention";
import { NextRequest, NextResponse } from "next/server";

/** GET -> { ids, policy }: videos past the configured retention policy. 404 while retention is off. */
export async function GET(req: NextRequest) {
    const policy = authorizeRetention(req);
    if (policy instanceof NextResponse) return policy;

    try {
        return NextResponse.json({ ids: await listExpiredVideoIds(policy), policy });
    } catch (error) {
        console.error("Error listing expired videos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
