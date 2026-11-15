import { Metadata } from "next";
import { ReactNode } from "react";

// The watch page (/video/[id]) is the video's page in search: it carries the
// VideoObject structured data with the thumbnail. Indexed on its own, the bare
// player here gets flagged as a video with no thumbnail. indexifembedded still
// lets Google index the video on third-party pages that iframe it.
export const metadata: Metadata = {
    robots: {
        index: false,
        googleBot: { index: false, indexifembedded: true },
    },
};

// Embeds render inside third-party iframes: no site chrome, just the player,
// letterboxed to fit whatever size the host page gives the iframe.
export default function EmbedLayout({ children }: { children: ReactNode }) {
    return <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">{children}</div>;
}
