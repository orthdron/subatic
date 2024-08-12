import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { createS3Client } from "@/lib/s3";
import {
    CreateMultipartUploadCommand,
    UploadPartCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const PART_SIZE = 10 * 1024 * 1024; // 10MB part size to match client-side CHUNK_SIZE

export async function POST(req: NextRequest) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, size, contentType } = body;

    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "0", 10) * 1024 * 1024;

    const { s3client, error } = createS3Client();
    if (error || !s3client) {
        return NextResponse.json({ error }, { status: 500 });
    }

    if (size === 0) {
        return NextResponse.json({ error: "Invalid file size." }, { status: 400 });
    }

    if (size > maxFileSize) {
        return NextResponse.json({ error: "File size too large." }, { status: 400 });
    }

    const video = await db.insertInto("video")
        .values({
            title: title,
            description: "",
            userId: user.id
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

    // Update the Key to include the /uploads directory
    const key = `uploads/${video.id}`;

    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        ContentType: contentType
    });

    try {
        const multipartUpload = await s3client.send(createMultipartUploadCommand);
        const uploadId = multipartUpload.UploadId;

        // Generate presigned URLs for each part
        const partCount = Math.ceil(size / PART_SIZE);
        const presignedUrls = [];

        for (let partNumber = 1; partNumber <= partCount; partNumber++) {
            const command = new UploadPartCommand({
                Bucket: process.env.BUCKET_NAME!,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNumber,
                ContentLength: Math.min(PART_SIZE, size - (partNumber - 1) * PART_SIZE),
            });
            const signedUrl = await getSignedUrl(s3client, command, { expiresIn: 3600 });
            presignedUrls.push({ partNumber, signedUrl });
        }

        return NextResponse.json({
            id: video.id,
            key,
            uploadId: uploadId,
            parts: presignedUrls,
        });
    } catch (error) {
        console.error("Error initiating multipart upload:", error);
        return NextResponse.json({ error: "Failed to initiate upload" }, { status: 500 });
    }
}