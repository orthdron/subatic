/**
 * URLs for the files the transcoder writes for each video
 * (see subatic-transcoding: HLS stream, sprite thumbnails, GIF previews, poster).
 * Server-only: PROCESSED_VIDEO_URL is not exposed to the browser.
 */
function processedVideoBaseUrl(): string {
    const url = process.env.PROCESSED_VIDEO_URL?.replace(/\/+$/, "");
    if (!url) {
        throw new Error("PROCESSED_VIDEO_URL is not defined");
    }
    return url;
}

export function videoMedia(id: string) {
    const base = `${processedVideoBaseUrl()}/${id}`;
    return {
        stream: `${base}/master.m3u8`,
        thumbnailTrack: `${base}/sprite.vtt`,
        poster: `${base}/poster.jpg`,
        previewShort: `${base}/short.gif`,
        previewLong: `${base}/long.gif`,
    };
}

export type VideoMedia = ReturnType<typeof videoMedia>;
