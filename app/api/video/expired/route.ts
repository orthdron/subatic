import { listExpiredVideoIds, rejectUnlessWebhookToken, retentionPolicy } from "@/lib/retention";
import { NextRequest, NextResponse } from "next/server";

/** GET ?olderThanDays=30&keepUser=admin[&keepUser=...] -> { ids: [...] } */
export async function GET(req: NextRequest) {
    const rejected = rejectUnlessWebhookToken(req);
    if (rejected) return rejected;

    const params = req.nextUrl.searchParams;
    const policy = retentionPolicy.safeParse({
        olderThanDays: params.get("olderThanDays"),
        keepUsers: params.getAll("keepUser"),
    });
    if (!policy.success) {
        return NextResponse.json({ error: "Invalid input", details: policy.error.issues }, { status: 400 });
    }

    try {
        return NextResponse.json({ ids: await listExpiredVideoIds(policy.data) });
    } catch (error) {
        console.error("Error listing expired videos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
