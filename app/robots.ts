import { requestOrigin } from "@/lib/site-url";
import type { MetadataRoute } from "next";

/** /robots.txt: crawl everything except the API, and point crawlers at the sitemap. */
export default async function robots(): Promise<MetadataRoute.Robots> {
    const origin = await requestOrigin();
    return {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: `${origin}/sitemap.xml`,
    };
}
