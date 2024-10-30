import { db } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const video = await db.selectFrom('video')
        .selectAll()
        .where('id', '=', id)
        .execute();

    if (!video) {
        return NextResponse.json({ error: "Not found" }, { status: 400 });
    }
    console.log(video)
    return NextResponse.json(video[0], { status: 200 });
}