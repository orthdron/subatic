import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="content" className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
