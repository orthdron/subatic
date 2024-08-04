import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {

    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const videoId: string = data.get("id") as string;
    const title: string = data.get("title") as string;
    const description: string = data.get("description") as string;

    try {
        const existingVideo = await db.selectFrom("video")
            .selectAll()
            .where('id', '=', videoId)
            .where('userId', '=', user.id)
            .executeTakeFirstOrThrow();

        if (!existingVideo) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log(title);
        console.log(description);
        await db.updateTable('video')
            .set({
                title: title,
                description: description,
            })
            .where('id', '=', existingVideo.id)
            .executeTakeFirst();

        const updatedVideo = db.selectFrom('video')
            .selectAll()
            .where('id', '=', existingVideo.id)
            .executeTakeFirst();

        return NextResponse.json(updatedVideo, { status: 200 });
    } catch (error) {
        // TODO: Log abuse
        console.log(user);
        console.log(data);
        console.log(error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
