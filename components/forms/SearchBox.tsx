"use client";

import { fieldControlClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function termFromPath(pathname: string): string {
    if (!pathname.startsWith("/search/")) return "";
    try {
        return decodeURIComponent(pathname.slice("/search/".length));
    } catch {
        return "";
    }
}

export default function SearchBox() {
    const pathname = usePathname();
    const router = useRouter();
    const [term, setTerm] = useState(() => termFromPath(pathname));

    // Keep the box in sync when navigating (e.g. back to the home page).
    const [syncedPath, setSyncedPath] = useState(pathname);
    if (pathname !== syncedPath) {
        setSyncedPath(pathname);
        setTerm(termFromPath(pathname));
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const query = term.trim();
        if (query) {
            router.push(`/search/${encodeURIComponent(query)}`);
        }
    };

    return (
        <form role="search" onSubmit={handleSubmit} className="relative">
            <label htmlFor="site-search" className="sr-only">
                Search videos
            </label>
            <Search
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-usher"
            />
            <input
                id="site-search"
                type="search"
                enterKeyHint="search"
                placeholder="Search videos"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className={cn(fieldControlClass, "h-10 rounded-full pl-10 pr-4")}
            />
        </form>
    );
}
