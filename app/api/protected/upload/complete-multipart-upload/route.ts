import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { createS3Client } from "@/lib/s3";
import {
    CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { uploadId, key, id, parts } = body;
    console.log({ uploadId, key, id, parts });


    const { s3client, error } = createS3Client();
    if (error || !s3client) {
        return NextResponse.json({ error }, { status: 500 });
    }

    const command = new CompleteMultipartUploadCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
    });

    try {
        const data = await s3client.send(command);

        await db.updateTable("video")
            .set({
                status: "UPLOADED"
            })
            .where('userId', '=', user.id)
            .where('id', '=', id)
            .execute();

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error completing multipart upload:", error);
        return NextResponse.json({ error: "Failed to complete upload" }, { status: 500 });
    }
}