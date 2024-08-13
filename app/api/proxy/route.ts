import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const s3Endpoint = process.env.RAWFILES_S3_ENDPOINT;

    // Ensure the URL is valid
    if (!s3Endpoint) {
        return NextResponse.json({ error: "S3 endpoint not configured." }, { status: 500 });
    }

    // Change the path to point to the S3 endpoint
    url.hostname = new URL(s3Endpoint).hostname;
    url.protocol = new URL(s3Endpoint).protocol;

    const response = await fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    const responseBody = await response.text();
    return NextResponse.json(responseBody, { status: response.status });
}

export async function POST(req: NextRequest) {
    const url = req.nextUrl.clone();
    const s3Endpoint = process.env.RAWFILES_S3_ENDPOINT;

    if (!s3Endpoint) {
        return NextResponse.json({ error: "S3 endpoint not configured." }, { status: 500 });
    }

    url.hostname = new URL(s3Endpoint).hostname;
    url.protocol = new URL(s3Endpoint).protocol;

    const response = await fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
    });

    const responseBody = await response.text();
    return NextResponse.json(responseBody, { status: response.status });
}
