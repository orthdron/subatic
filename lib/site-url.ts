import { headers } from "next/headers";

/** This site's origin (e.g. https://subatic.com) as seen by the current request. */
export async function requestOrigin(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    return `${protocol}://${host}`;
}
