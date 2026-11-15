import { ReactNode } from "react";

// Embeds render inside third-party iframes: no site chrome, just the player,
// letterboxed to fit whatever size the host page gives the iframe.
export default function EmbedLayout({ children }: { children: ReactNode }) {
    return <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">{children}</div>;
}
