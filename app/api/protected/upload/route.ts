import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {

    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "0", 10) * 1024 * 1024;
    const region = process.env.AWS_REGION;
    const bucketName = process.env.BUCKET_NAME;
    if (
        !accessKeyId ||
        !secretAccessKey ||
        !maxFileSize ||
        !region ||
        !bucketName
    ) {
        return NextResponse.json(
            { error: "This functionality is down. Please come back later." },
            { status: 500 }
        );
    }
    const fileSize = body.size || 0;
    if (fileSize == 0) {
        return NextResponse.json({ error: "Invalid file size." }, { status: 400 });
    }
    if (fileSize > maxFileSize) {
        console.log(body.size);
        console.log(maxFileSize);
        return NextResponse.json(
            { error: "File size too large." },
            { status: 400 }
        );
    }
    const video = await db.insertInto("video")
        .values({
            title: body.title,
            description: "",
            userId: user.id
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

    const s3client = new S3Client({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: video.id,
        ContentLength: body.size,
    });

    const url = await getSignedUrl(s3client, command, {
        expiresIn: 14400,
    });
    return NextResponse.json({
        id: video.id,
        url: url,
    });
}