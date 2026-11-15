"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/** Header link that marks itself as the current page. */
export default function NavLink({ href, children }: { href: string; children: ReactNode }) {
    const pathname = usePathname();
    const isCurrent = pathname === href;

    return (
        <Link
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), isCurrent && "bg-stage-raised text-screen")}
        >
            {children}
        </Link>
    );
}
